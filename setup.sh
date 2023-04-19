python -m venv venv
. tenv/bin/activate
pip install -r requirements.txt
python db-setup.py
flask run