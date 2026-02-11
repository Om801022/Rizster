from app import create_app

app = create_app()

# Print all registered routes
print("\n=== REGISTERED ROUTES ===")
print(app.url_map)
print("=========================\n")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

