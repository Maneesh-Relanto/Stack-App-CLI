from flask import Blueprint
from app.api.v1 import health

api_bp = Blueprint('api', __name__)
api_bp.register_blueprint(health.bp)
