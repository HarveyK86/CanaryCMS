# CanaryCMS
## C9 Setup
1. `sudo apt install python3.5-venv`
2. `python3.5 -mvenv venv`
3. `source venv/bin/activate`
4. `sudo pip install -r venv-requirements.txt`
5. `export SECRET_KEY="$(openssl passwd -1 <your password here>)"`
6. `python CanaryCMS/manage.py migrate`
7. `python CanaryCMS/manage.py createsuperuser`
9. `python CanaryCMS/manage.py runserver 0.0.0.0:8080`

## Run
1. `source venv/bin/activate`
2. `export SECRET_KEY="$(openssl passwd -1 <your password here>)"`
3. `python CanaryCMS/manage.py runserver 0.0.0.0:8080`

## Useful Commands
* `pip freeze > venv-requirements.txt`
* `python CanaryCMS/manage.py makemigrations public`
* `python CanaryCMS/manage.py migrate public`