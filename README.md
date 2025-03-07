# YOLOv8 Object Detection Web App

This is a web application that uses YOLOv8 for real-time object detection. Users can upload images and get bounding boxes with confidence scores for detected objects.

## Screenshot
![YOLOv8 Object Detection Demo](screenshots/Screenshot%202025-03-07%20at%202.21.29%20PM.png)

## Features

- Image upload interface
- Real-time object detection using YOLOv8
- Display of bounding boxes and confidence scores
- Modern UI with Next.js and Tailwind CSS

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd yolo-classifier
```

2. Set up the Python virtual environment and install dependencies:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install ultralytics fastapi python-multipart uvicorn
```

3. Install Node.js dependencies:
```bash
npm install
```

## Running the Application

1. Start the FastAPI backend (in one terminal):
```bash
source venv/bin/activate  # On Windows use: venv\Scripts\activate
cd api
python main.py
```

2. Start the Next.js frontend (in another terminal):
```bash
npm run dev
```

3. Open your browser and navigate to http://localhost:3000

## Usage

1. Open the web application in your browser
2. Click the upload button or drag and drop an image
3. Wait for the processing to complete
4. View the detected objects with their bounding boxes and confidence scores

## Technologies Used

- Frontend:
  - Next.js
  - React
  - Tailwind CSS
  - TypeScript

- Backend:
  - FastAPI
  - YOLOv8
  - OpenCV
  - Python

## License

MIT 