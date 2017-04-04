# CanaryCMS
## C9 Setup
1. `sudo pip3 install -r c9-requirements.txt`
2. `virtualenv venv`
3. `source venv/bin/activate`
4. `sudo pip3 install -r venv-requirements.txt`
5. `export SECRET_KEY="$(openssl passwd -1 <your password here>)"`
6. `python3 CanaryCMS/manage.py migrate`

## Run
`python3 CanaryCMS/manage.py migrate`