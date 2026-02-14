import os
from app import create_app, db
from flask_migrate import MigrateCommand
from flask_script import Manager

app = create_app(os.getenv('FLASK_ENV', 'development'))
manager = Manager(app)
manager.add_command('db', MigrateCommand)


@manager.command
def create_admin():
    """Create a new admin user."""
    pass


if __name__ == '__main__':
    manager.run()
