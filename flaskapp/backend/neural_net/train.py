from flaskapp.backend.neural_net import load_data_penguins
from flaskapp.backend.neural_net import MSENetwork
import time

NEURONS_PER_LAYER = [4,3,3,3]


def evaluate_model(my_net, X_test, y_test):
    inference = my_net.forward(X_test)
    my_net.print_losses()
    print("Accuracy: ", my_net.check_accuracy(y_test, inference))


def train_model(batch_size=16, epochs=1000, learning_rate=5e-3, rel_tol=1e-5, loss_step=100):
    X_train, X_test, y_train, y_test, _ = load_data_penguins("species")
    my_net = MSENetwork(NEURONS_PER_LAYER)

    start = time.time()
    my_net.train(X_train, y_train, batch_size, epochs, learning_rate, rel_tol, loss_step)
    print("Time elapsed during training: ", time.time() - start)

    evaluate_model(my_net, X_test, y_test)
    my_net.save_gradients()
    my_net.save_params()