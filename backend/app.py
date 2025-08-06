from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

from models import db, User, Appointment, Task

# Carregar variáveis de ambiente
load_dotenv()

app = Flask(__name__, static_folder='../frontend/build', static_url_path='')

# Configurações usando variáveis de ambiente
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 
    'sqlite:///agenda_facil.db'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv(
    'JWT_SECRET_KEY', 
    'sua-chave-secreta-muito-segura-para-desenvolvimento'
)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Configurar CORS baseado no ambiente
is_production = os.getenv('FLASK_ENV') == 'production'

if is_production:
    # Em produção, permitir origins específicos
    cors_origins = os.getenv('CORS_ORIGINS', '').split(',')
    if cors_origins == ['']:
        # Se não especificado, permitir qualquer origem HTTPS
        cors_origins = ['https://*']
else:
    # Em desenvolvimento, permitir localhost
    cors_origins = ['http://localhost:3000', 'http://127.0.0.1:3000']

# Inicializar extensões
db.init_app(app)
jwt = JWTManager(app)
CORS(app, 
     origins=cors_origins,
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

# Health check endpoint
@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'AgendaFácil API is running',
        'environment': os.getenv('FLASK_ENV', 'development')
    }), 200

# APIs de Autenticação
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        if not all([name, email, password]):
            return jsonify({'error': 'Todos os campos são obrigatórios'}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Este e-mail já está cadastrado'}), 400
        
        user = User(name=name, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not all([email, password]):
            return jsonify({'error': 'E-mail e senha são obrigatórios'}), 400
        
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'E-mail ou senha incorretos'}), 401
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# APIs de Compromissos
@app.route('/api/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    try:
        user_id = get_jwt_identity()
        date_filter = request.args.get('date')
        
        query = Appointment.query.filter_by(user_id=user_id)
        
        if date_filter:
            try:
                filter_date = datetime.strptime(date_filter, '%Y-%m-%d').date()
                query = query.filter_by(date=filter_date)
            except ValueError:
                return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        
        appointments = query.order_by(Appointment.date.asc(), Appointment.time.asc()).all()
        
        return jsonify({
            'appointments': [appointment.to_dict() for appointment in appointments]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        print(f"[DEBUG] Creating appointment for user {user_id}")
        print(f"[DEBUG] Request data: {data}")
        
        title = data.get('title')
        description = data.get('description', '')
        date_str = data.get('date')
        time = data.get('time')
        
        if not all([title, date_str, time]):
            print("[DEBUG] Error: Missing required fields")
            return jsonify({'error': 'Título, data e horário são obrigatórios'}), 400
        
        try:
            appointment_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            print(f"[DEBUG] Error: Invalid date format: {date_str}")
            return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        
        # Validar formato do horário
        try:
            datetime.strptime(time, '%H:%M')
        except ValueError:
            print(f"[DEBUG] Error: Invalid time format: {time}")
            return jsonify({'error': 'Formato de horário inválido. Use HH:MM'}), 400
        
        appointment = Appointment(
            user_id=user_id,
            title=title,
            description=description,
            date=appointment_date,
            time=time
        )
        
        print(f"[DEBUG] Created appointment object: {appointment.to_dict()}")
        
        db.session.add(appointment)
        db.session.commit()
        
        print(f"[DEBUG] Appointment saved to database with ID: {appointment.id}")
        
        return jsonify({
            'message': 'Compromisso criado com sucesso',
            'appointment': appointment.to_dict()
        }), 201
        
    except Exception as e:
        print(f"[DEBUG] Error creating appointment: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/appointments/<appointment_id>', methods=['PUT'])
@jwt_required()
def update_appointment(appointment_id):
    try:
        user_id = get_jwt_identity()
        appointment = Appointment.query.filter_by(id=appointment_id, user_id=user_id).first()
        
        if not appointment:
            return jsonify({'error': 'Compromisso não encontrado'}), 404
        
        data = request.get_json()
        
        if 'title' in data:
            appointment.title = data['title']
        if 'description' in data:
            appointment.description = data['description']
        if 'date' in data:
            try:
                appointment.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        if 'time' in data:
            try:
                datetime.strptime(data['time'], '%H:%M')
                appointment.time = data['time']
            except ValueError:
                return jsonify({'error': 'Formato de horário inválido. Use HH:MM'}), 400
        
        appointment.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Compromisso atualizado com sucesso',
            'appointment': appointment.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/appointments/<appointment_id>', methods=['DELETE'])
@jwt_required()
def delete_appointment(appointment_id):
    try:
        user_id = get_jwt_identity()
        appointment = Appointment.query.filter_by(id=appointment_id, user_id=user_id).first()
        
        if not appointment:
            return jsonify({'error': 'Compromisso não encontrado'}), 404
        
        db.session.delete(appointment)
        db.session.commit()
        
        return jsonify({'message': 'Compromisso excluído com sucesso'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# APIs de Tarefas
@app.route('/api/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    try:
        user_id = get_jwt_identity()
        status_filter = request.args.get('status')
        priority_filter = request.args.get('priority')
        
        query = Task.query.filter_by(user_id=user_id)
        
        if status_filter:
            query = query.filter_by(status=status_filter)
        
        if priority_filter:
            query = query.filter_by(priority=priority_filter)
        
        tasks = query.order_by(Task.created_at.desc()).all()
        
        return jsonify({
            'tasks': [task.to_dict() for task in tasks]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
@jwt_required()
def create_task():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        title = data.get('title')
        description = data.get('description', '')
        priority = data.get('priority', 'medium')
        status = data.get('status', 'pending')
        due_date_str = data.get('due_date')
        
        if not title:
            return jsonify({'error': 'Título é obrigatório'}), 400
        
        # Validar prioridade
        if priority not in ['low', 'medium', 'high']:
            return jsonify({'error': 'Prioridade inválida'}), 400
        
        # Validar status
        if status not in ['pending', 'in_progress', 'completed']:
            return jsonify({'error': 'Status inválido'}), 400
        
        due_date = None
        if due_date_str:
            try:
                due_date = datetime.strptime(due_date_str, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        
        task = Task(
            user_id=user_id,
            title=title,
            description=description,
            priority=priority,
            status=status,
            due_date=due_date
        )
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify({
            'message': 'Tarefa criada com sucesso',
            'task': task.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    try:
        user_id = get_jwt_identity()
        task = Task.query.filter_by(id=task_id, user_id=user_id).first()
        
        if not task:
            return jsonify({'error': 'Tarefa não encontrada'}), 404
        
        data = request.get_json()
        
        if 'title' in data:
            task.title = data['title']
        if 'description' in data:
            task.description = data['description']
        if 'priority' in data:
            if data['priority'] not in ['low', 'medium', 'high']:
                return jsonify({'error': 'Prioridade inválida'}), 400
            task.priority = data['priority']
        if 'status' in data:
            if data['status'] not in ['pending', 'in_progress', 'completed']:
                return jsonify({'error': 'Status inválido'}), 400
            task.status = data['status']
        if 'due_date' in data:
            if data['due_date']:
                try:
                    task.due_date = datetime.strptime(data['due_date'], '%Y-%m-%d').date()
                except ValueError:
                    return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
            else:
                task.due_date = None
        
        task.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Tarefa atualizada com sucesso',
            'task': task.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    try:
        user_id = get_jwt_identity()
        task = Task.query.filter_by(id=task_id, user_id=user_id).first()
        
        if not task:
            return jsonify({'error': 'Tarefa não encontrada'}), 404
        
        db.session.delete(task)
        db.session.commit()
        
        return jsonify({'message': 'Tarefa excluída com sucesso'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Servir arquivos estáticos do React
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    port = int(os.getenv('PORT', 5000))
    debug = not is_production
    
    app.run(debug=debug, host='0.0.0.0', port=port)