# Digital Stamping System for Document Authentication

## Overview
The Digital Stamping System is a robust, user-friendly web application designed to replace traditional physical stamps for document authentication. It offers a secure, scalable, and efficient platform for individuals, small businesses, and organizations to electronically stamp and manage documents.

---


## **Features**
### **Core Functionalities**
- **Document Upload and Display**:
  - Upload PDF, JPEG, or PNG documents.
  - Zoom, pan, and navigate multi-page documents.
- **Stamp Creation and Customization**:
  - Create customizable stamps with shapes, colors, text, and logos.
  - Add real-time timestamps and unique identifiers for traceability.
- **Stamp Placement**:
  - Drag-and-drop or click-to-place stamps on documents.
  - Preview stamps before finalizing their position.
- **Document Management**:
  - Save stamped documents securely.
  - Download stamped documents directly or store them in the system.
  - Version control for tracking changes.

### **Dynamic Features**
- Automatic timestamping with real-time accuracy.
- Secure authentication with traceable metadata storage.

---

## **Tech Stack**
- **Front-End**: 
  - React.js
  - Bootsrap CSS / Material-UI
  - Canvas rendering libraries (e.g., Fabric.js, Konva.js)
- **Back-End**: 
  - Django
  - Django REST Framework
  - PostgreSQL
- **Deployment Platforms**:
  - Front-End: Netlify or Vercel
  - Back-End: Heroku, AWS, or DigitalOcean

---

## **Setup Instructions**
### **Prerequisites**
- Node.js and npm
- Python 3.8+ and pip
- PostgreSQL database
### **Steps to Run the Project**
1. **Clone the Repository**:
bash
git clone git@github.com:Mercykemboi/DocumentStamping.git
cd DocumentStamping.git

2. **Front-End Setup**:
  - Navigate the Frontend Folder and cd into it(cd frontend)
  - Intall all dependencies.(npm Install)
  - Start the Development server (npm start)


3. **Back-End Setup**:
   - Navigate the Backend Folder and cd into it(cd Backend)
   - Create a virtual environment(python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
)
   -  Intall all dependencies.(pip install -r requirements.txt)
   -  Configure the database settings in settings.py
   -  Apply migrations and start the server:(python manage.py migrate, python manage.py runserver)


4. **Run-Test**:
  - Execute front-end and back-end tests using
   **For back-end**
python manage.py test

**For front-end (React.js)**
  npm test

## **Usage Instructions**
**Login/Register** :

- Sign in or create a new account to access the system.

 **Upload a Document**:

- Select a document to upload in supported formats (PDF, JPEG, PNG).

**Create and Customize Stamps**:

- Navigate to the stamp creation section to design your stamp.
- Save the stamp to your "My Stamps" library.

 **Apply Stamps to the Document**:

- Open the uploaded document in the interactive canvas.
- Drag and drop or click to place the stamp where needed.

 **Save or Download**:

- Save the stamped document to your account or download it directly.


## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Collaborators
- Mercy Kemboi: Developer and project creator
- Feel free to contribute to the project by forking it or submitting issues/pull requests.




