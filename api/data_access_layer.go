package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"
)

func fetchDbItems() ([]Item, error) {
	var items []Item
	rows, err := db.Query("SELECT * FROM item LIMIT 10")
	if err != nil {
		return nil, fmt.Errorf("allItems: %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var (
			item     Item
			price    sql.NullFloat64
			quantity sql.NullInt64
		)

		if err := rows.Scan(&item.ID, &item.ExternalID, &item.Description, &price, &quantity); err != nil {
			return nil, fmt.Errorf("allItems: %v", err)
		}

		if price.Valid {
			item.Price = &price.Float64
		}

		if quantity.Valid {
			qty := int(quantity.Int64)
			item.Quantity = &qty
		}

		items = append(items, item)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("allItems: %v", err)
	}

	return items, nil
}

func fetchDbItem(itemId string) (Item, error) {
	var item Item
	var price sql.NullFloat64
	var quantity sql.NullInt64

	err := db.QueryRow("SELECT * FROM item WHERE external_id = $1", itemId).Scan(&item.ID, &item.ExternalID, &item.Description, &price, &quantity)
	if err != nil {
		return Item{}, err
	}

	if price.Valid {
		item.Price = &price.Float64
	}

	if quantity.Valid {
		qty := int(quantity.Int64)
		item.Quantity = &qty
	}

	return item, nil
}

func updateDbItem(item *Item) error {
	if err := validateItem(item); err != nil {
		return err
	}

	stmt, err := db.Prepare("UPDATE item SET description = $1, price = $2, quantity = $3 WHERE id = $4")
	if err != nil {
		return fmt.Errorf("updateDbItem: %v", err)
	}
	defer stmt.Close()

	_, err = stmt.Exec(item.Description, item.Price, item.Quantity, item.ID)
	if err != nil {
		return fmt.Errorf("e rror updating item: %v", err)
	}

	return nil
}

func createDbItem(item Item) (Item, error) {
	stmt, err := db.Prepare("INSERT INTO item (external_id, description, price, quantity) VALUES ($1, $2, $3, $4) RETURNING id")
	if err != nil {
		return Item{}, fmt.Errorf("createDbItem: %v", err)
	}
	defer stmt.Close()

	var id string
	err = stmt.QueryRow(item.ExternalID, item.Description, item.Price, item.Quantity).Scan(&id)
	if err != nil {
		return Item{}, fmt.Errorf("createDbItem: %v", err)
	}

	item.ID = id
	return item, nil
}

func extractPathParam(r *http.Request, routePrefix string) (string, error) {
	param := strings.TrimPrefix(r.URL.Path, routePrefix)

	if param == "" || param == "/" {
		return "", fmt.Errorf("parameter is required")
	}

	return param, nil
}

func validateItem(item *Item) error {
	if item.ID == "" {
		return fmt.Errorf("ID is required")
	}

	if item.ExternalID == "" {
		return fmt.Errorf("external ID is required")
	}

	if item.Price == nil {
		return fmt.Errorf("price is requried")
	}

	if item.Price != nil && *item.Price < 0 {
		return fmt.Errorf("price must be non-negative")
	}

	if item.Quantity == nil {
		return fmt.Errorf("quantity is required")
	}

	return nil
}
