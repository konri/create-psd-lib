1. install LTS version of nodejs from here: https://nodejs.org/en/download/ 
2. open terminal (command line in windows: https://www.howtogeek.com/235101/10-ways-to-open-the-command-prompt-in-windows-10/) 
3. go to project directory 
4. install dependencies from project, type in terminal: `npm install`
5. open with edit program(ex. notepad) file: `configuration.txt`  
6. put absolute path for catalog 

example: 

`
PATH_CARS=/Users/Konrad/workspace/create_pds_file/cars
PATH_BACKGROUND=/Users/Konrad/workspace/create_pds_file/const/BACKGROUND/3BACKGROUND.png
PATH_SHADOW=/Users/Konrad/workspace/create_pds_file/const/SHADOW
PATH_OUTPUT=/Users/Konrad/workspace/create_pds_file/output
`

    - **PATH_CARS** - absolute path for catalog where has render of cars in folders 001, 002, .... 
    - **PATH_BACKGROUND** - absolute path for single file for background
    - **PATH_SHADOW** - absolute path for catalog where has renders with sequential number: 2SHADOW01.png, 2SHADOW02.png ...
    - **PATH_OUTPUT** - absolute path for catalog where output psd fill be generated. 

7 run script in terminal: `npm start`
