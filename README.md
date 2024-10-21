## DESCRIPTION

### Frontend
The `index.html` file serves as the main interface for the backpropagation explainer tool. It provides the structure for displaying neural network nodes, paths, and other elements using D3.js. The file includes JavaScript functions for creating node and path data, as well as displaying images corresponding to the output of the neural network. It also contains elements for controlling and updating formulas dynamically based on user interaction, such as scrolling and clicking events. The file utilizes SVG and HTML elements to render the neural network visualization and interactive components seamlessly within a web browser. `style.css` includes the styling for components rendered in our index.html file.

### Middleware
This `routes.py` script serves as the middle layer of the Flask web application for the backpropagation explainer tool. It defines several routes essential for the application's functionality, including rendering the main page (`/` or `/index`), retrieving LaTeX expressions for neural network edges (`/latex_expression`), expanding mathematical expressions for tooltips (`/expand`), fetching LaTeX expressions for mathematical formulas (`/latex_expression_math`), and expanding mathematical expressions (`/expand_math`). These routes handle the generation and processing of data crucial for explaining neural network operations and mathematical concepts within the application.

### Backend
The `utils.py` module provides essential functions for generating backpropagation formulas and expanding mathematical expressions within the neural network explainer tool. The functions produce LaTeX expressions representing the backpropagation process for specific network edges. They are crucial for explaining how gradients flow through the network during backpropagation. Additionally, `expand_formula` and `expand_math` handle the expansion of mathematical expressions, enabling detailed visualization of the network's operations.

The `compute_results.py` script handles the computation of gradients and related matrices for a neural network trained on the MNIST dataset, while `train.py` trains the network using a single data point. In `compute_results.py`, biases, weights, and various gradient-related matrices are loaded from files, and then computations are performed on these loaded data. Notably, `matrix_3` is computed as the mean of one of the gradient-related matrices. In `train.py`, a single data point is loaded, and a neural network model (`myNet`) is created and trained using this single data point. After training, the gradients from each layer are saved to files for further analysis. These scripts facilitate the training and analysis of neural networks, allowing for the examination of gradients and related matrices to better understand network behavior and performance on the MNIST dataset. The resources folder includes all the utility scripts needed to run the neural network.

## INSTALLATION
To begin, you can clone the "Backpropagation-Explainer" repository from GitHub (it is currently private) or if you have the code installed on your local then you should be set to go. Navigate to the root directory of the project so we can now install the dependencies. The following dependencies in requirements.txt will need to be installed (using pip or any environment management software like conda). Using pip, the command would look like `pip install -r requirements.txt`. Once the dependencies are installed, you are ready to set up the flask app. The EXECUTION section walks you through the section.

## EXECUTION
Navigate to the root directory of the "Backpropagation-Explainer" project in a terminal.
Execute the following command to run the Flask app: `python run.py`.
Once the Flask app is running, open a web browser and navigate to `http://127.0.0.1:3001` or `http://localhost:3001`.
You will be directed to the main page of the application where you can interact with the backpropagation explainer tool.
