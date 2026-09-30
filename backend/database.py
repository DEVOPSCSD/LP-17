import sqlite3

DATABASE = "devops.db"


def get_db_connection():

    connection = sqlite3.connect(DATABASE)

    connection.row_factory = sqlite3.Row

    return connection


def init_db():

    connection = get_db_connection()

    # =========================================
    # PROJECTS TABLE
    # =========================================

    connection.execute("""
        CREATE TABLE IF NOT EXISTS projects (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            environment TEXT NOT NULL,

            cloud TEXT NOT NULL,

            region TEXT NOT NULL,

            instance_type TEXT NOT NULL,

            docker_enabled INTEGER NOT NULL,

            description TEXT
        )
    """)

    # =========================================
    # DEPLOYMENTS TABLE
    # =========================================

    connection.execute("""
        CREATE TABLE IF NOT EXISTS deployments (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            project_id INTEGER NOT NULL,

            project_name TEXT NOT NULL,

            environment TEXT NOT NULL,

            version TEXT,

            status TEXT NOT NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (project_id)
                REFERENCES projects(id)
        )
    """)

    connection.commit()

    connection.close()