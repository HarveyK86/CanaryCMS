# CanaryCMS
## C9 Setup
1. `sudo apt install python3.5-venv`
2. `python3.5 -mvenv venv`
3. `source venv/bin/activate`
4. `pip install --upgrade pip`
5. `sudo -H pip install -r venv-requirements.txt`
6. `export SECRET_KEY="$(openssl passwd -1 <your password here>)"`
7. `python CanaryCMS/manage.py migrate`
8. `python CanaryCMS/manage.py createsuperuser`
9. `python CanaryCMS/manage.py loaddata standard`
10. `python CanaryCMS/manage.py runserver 0.0.0.0:8080`

## Run
1. `source venv/bin/activate`
2. `export SECRET_KEY="$(openssl passwd -1 <your password here>)"`
3. `python CanaryCMS/manage.py runserver 0.0.0.0:8080`

## Useful Commands
* `pip freeze > venv-requirements.txt`
* `sudo rm-rf venv`
* `python CanaryCMS/manage.py dumpdata --format=json core > CanaryCMS/public/fixtures/standard.json`
* `python CanaryCMS/manage.py makemigrations core`
* `python CanaryCMS/manage.py migrate core`