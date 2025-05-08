from flask import Blueprint, request, jsonify
from app.models import Session, User, Group
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

sessions_bp = Blueprint('sessions', __name__)

# Create a new session
@sessions_bp.route('', methods=['POST'])
@jwt_required()
def create_session():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['title', 'date_time', 'group_id']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    # Check if group exists
    group = Group.query.get(data['group_id'])
    if not group:
        return jsonify({'error': 'Group not found'}), 404
    
    # Check if user is a member of the group
    user = User.query.get(user_id)
    if user not in group.members:
        return jsonify({'error': 'You must be a member of the group to create a session'}), 403
    
    try:
        # Parse date_time
        try:
            date_time = datetime.fromisoformat(data['date_time'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date_time format. Please use ISO format.'}), 400
        
        new_session = Session(
            title=data['title'],
            description=data.get('description', ''),
            date_time=date_time,
            location=data.get('location', ''),
            group_id=data['group_id'],
            created_by=user_id
        )
        
        db.session.add(new_session)
        db.session.commit()
        
        return jsonify({
            'message': 'Session created successfully',
            'session': new_session.to_dict()
        }), 201
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all sessions
@sessions_bp.route('', methods=['GET'])
@jwt_required()
def get_all_sessions():
    try:
        sessions = Session.query.all()
        return jsonify([session.to_dict() for session in sessions]), 200
    
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# Get sessions for a specific group
@sessions_bp.route('/group/<int:group_id>', methods=['GET'])
@jwt_required()
def get_sessions_by_group(group_id):
    try:
        # Check if group exists
        group = Group.query.get(group_id)
        if not group:
            return jsonify({'error': 'Group not found'}), 404
        
        sessions = Session.query.filter_by(group_id=group_id).all()
        return jsonify([session.to_dict() for session in sessions]), 200
    
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# Get a specific session
@sessions_bp.route('/<int:session_id>', methods=['GET'])
@jwt_required()
def get_session(session_id):
    try:
        session = Session.query.get(session_id)
        
        if not session:
            return jsonify({'error': 'Session not found'}), 404
        
        return jsonify(session.to_dict()), 200
    
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# Update a session
@sessions_bp.route('/<int:session_id>', methods=['PUT'])
@jwt_required()
def update_session(session_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        session = Session.query.get(session_id)
        
        if not session:
            return jsonify({'error': 'Session not found'}), 404
        
        # Check if user is the creator
        if session.created_by != user_id:
            return jsonify({'error': 'Permission denied. Only the session creator can update the session'}), 403
        
        # Update fields
        if 'title' in data:
            session.title = data['title']
        if 'description' in data:
            session.description = data['description']
        if 'date_time' in data:
            try:
                session.date_time = datetime.fromisoformat(data['date_time'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid date_time format. Please use ISO format.'}), 400
        if 'location' in data:
            session.location = data['location']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Session updated successfully',
            'session': session.to_dict()
        }), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete a session
@sessions_bp.route('/<int:session_id>', methods=['DELETE'])
@jwt_required()
def delete_session(session_id):
    user_id = get_jwt_identity()
    
    try:
        session = Session.query.get(session_id)
        
        if not session:
            return jsonify({'error': 'Session not found'}), 404
        
        # Check if user is the creator
        if session.created_by != user_id:
            return jsonify({'error': 'Permission denied. Only the session creator can delete the session'}), 403
        
        db.session.delete(session)
        db.session.commit()
        
        return jsonify({'message': 'Session deleted successfully'}), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# RSVP to a session
@sessions_bp.route('/<int:session_id>/rsvp', methods=['POST'])
@jwt_required()
def rsvp_to_session(session_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    status = data.get('status', 'attending')  # Default to attending
    
    try:
        session = Session.query.get(session_id)
        user = User.query.get(user_id)
        
        if not session:
            return jsonify({'error': 'Session not found'}), 404
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if user is a member of the group
        group = Group.query.get(session.group_id)
        if user not in group.members:
            return jsonify({'error': 'You must be a member of the group to RSVP to a session'}), 403
        
        # Add user to session participants
        if user not in session.participants:
            session.participants.append(user)
        
        db.session.commit()
        
        return jsonify({'message': f'Successfully RSVPed to the session as {status}'}), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Cancel RSVP to a session
@sessions_bp.route('/<int:session_id>/cancel-rsvp', methods=['POST'])
@jwt_required()
def cancel_rsvp(session_id):
    user_id = get_jwt_identity()
    
    try:
        session = Session.query.get(session_id)
        user = User.query.get(user_id)
        
        if not session:
            return jsonify({'error': 'Session not found'}), 404
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if user has RSVPed
        if user not in session.participants:
            return jsonify({'message': 'You have not RSVPed to this session'}), 200
        
        # Remove user from session participants
        session.participants.remove(user)
        db.session.commit()
        
        return jsonify({'message': 'Successfully cancelled RSVP to the session'}), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
