python -m venv venv
if [ $1 == "--w" ]
then
. venv/Scripts/activate
else
. venv/bin/activate
fi
pip install -r requirements.txt
python db-setup.py
flask run
