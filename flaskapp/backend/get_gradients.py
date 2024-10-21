from flaskapp.backend.neural_net import *
import numpy as np
import os

CUR_DIR = os.path.dirname(__file__)


def run_train_point():
    X_point, y_point = load_point()
    my_net = MSENetwork(NEURONS_PER_LAYER)

    my_net.train(X_point, y_point, batch_size=1, epochs=1, learning_rate=0)
    my_net.save_gradients()
    my_net.save_params()


def pull_gradient_values(layer_index, is_weight_gradient):    
    cur_dir = f'{CUR_DIR}/neural_net/data/gradients'
    upstream = np.load(f'{cur_dir}/upstream_{layer_index}.npy')
    intermediate = np.load(f'{cur_dir}/intermediate_{layer_index}.npy')
    local = np.load(f'{cur_dir}/local_{layer_index}.npy')
    downstream = np.load(f'{cur_dir}/downstream_{layer_index}.npy')
    weights = np.load(f'{cur_dir}/weights_{layer_index}.npy')

    upstream = np.mean(upstream[0], axis=-1)
    local = local[0][:,np.newaxis] * np.ones((1, upstream.shape[0]))
    downstream = np.mean(downstream[0], axis=-1)
    weights = weights[0]

    if is_weight_gradient:
        return upstream, local, weights
    else:
        return upstream, intermediate, downstream