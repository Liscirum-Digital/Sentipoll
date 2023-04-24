python -m venv venv
. venv/bin/activate
pip install -r requirements.txt
python db-setup.py
flask run
