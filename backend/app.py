from flask import Flask, jsonify, request
from flask_cors import CORS
from database import init_db, get_db_connection
app = Flask(__name__)
CORS(app)

# Initialize database
init_db()


@app.route("/")
def home():
    return jsonify({
        "message": "One Click DevOps Platform Backend is running"
    })


@app.route("/api/health")
def health():
    return jsonify({
        "status": "success",
        "message": "Backend is healthy"
    })


# Create a new project
@app.route("/api/projects", methods=["POST"])
def create_project():
    data = request.get_json()

    required_fields = [
        "name",
        "environment",
        "cloud",
        "region",
        "instance_type",
        "docker_enabled"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "status": "error",
                "message": f"Missing field: {field}"
            }), 400

    connection = get_db_connection()

    cursor = connection.execute("""
        INSERT INTO projects
        (name, environment, cloud, region, instance_type, docker_enabled, description)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        data["name"],
        data["environment"],
        data["cloud"],
        data["region"],
        data["instance_type"],
        data["docker_enabled"],
        data.get("description", "")
    ))

    connection.commit()
    project_id = cursor.lastrowid
    connection.close()

    return jsonify({
        "status": "success",
        "message": "Project created successfully",
        "project_id": project_id
    }), 201


# Get all projects
@app.route("/api/projects", methods=["GET"])
def get_projects():
    connection = get_db_connection()

    projects = connection.execute(
        "SELECT * FROM projects"
    ).fetchall()

    connection.close()

    return jsonify([
        dict(project) for project in projects
    ])


if __name__ == "__main__":
    app.run(debug=True)