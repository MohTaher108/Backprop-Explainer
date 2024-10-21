""" routes.py - Flask route definitions

Flask requires routes to be defined to know what data to provide for a given
URL. The routes provided are relative to the base hostname of the website, and
must begin with a slash."""
from flaskapp import app
from flask import render_template, jsonify
from flask import request
from flaskapp.utils import generate_backprop_formula, generate_backprop_math, expand_formula, last_layer, expand_math
from flaskapp.backend import pull_gradient_values

# The following two lines define two routes for the Flask app, one for just
# '/', which is the default route for a host, and one for '/index', which is
# a common name for the main page of a site.
#
# Both of these routes provide the exact same data - that is, whatever is
# produced by calling `index()` below.
@app.route('/')
@app.route('/index')
def index():
    """Renders the index.html template"""
    # Renders the template (see the index.html template file for details). The
    # additional defines at the end (table, header, username) are the variables
    # handed to Jinja while it is processing the template.
    return render_template('index.html')

@app.route('/latex_expression', methods=['GET'])
def get_latex_string():
    param = request.args.get('edge', default='default_value', type=str)
    #edge definition, edge = ('h2_1', 'y_3')
    #example param = "path_x_0_h0_0"
    print(param)
    paramlist = param.split('_')
    print(paramlist)
    node1 = str(paramlist[1] + '_' + paramlist[2])
    node2 = str(paramlist[3] + '_' + paramlist[4])
    edge = (node1, node2) 
    

    result = generate_backprop_formula(edge)
    return jsonify({"expression": result})

#= \sum_{a=1}^{L^{(2)}} \frac{\partial L}{\partial n_a^{(2)}}
@app.route('/expand', methods=['GET'])
def get_tooltip():
    gradient = request.args.get('gradient', default='default_value', type=str)
    a = request.args.get('a', default='0', type=str)
    print("Grad", gradient)
    print("a", a)
   
    if "sum" in gradient:
        isLastLayer = 'L^{(3)}' in gradient
        gradient = '\\frac' + '\\frac'.join(gradient.split('\\frac')[1:])
        gradient = gradient.replace('_{a', '_{' + str(int(a)))
        if isLastLayer:
            result = last_layer(gradient)
            print(result)
            return jsonify({"expression": result})

    print(gradient)
    gradient = gradient.replace('_{a', '_{' + str(int(a)))
    result = expand_formula(gradient)
    print("result", result)
    return jsonify({"expression": result})

@app.route('/latex_expression_math', methods=['GET'])
def get_latex_math():
    param = request.args.get('edge', default='default_value', type=str)
    #edge definition, edge = ('h2_1', 'y_3')
    #example param = "path_x_0_h0_0"
    print(param)
    paramlist = param.split('_')
    print(paramlist)
    node1 = str(paramlist[1] + '_' + paramlist[2])
    node2 = str(paramlist[3] + '_' + paramlist[4])
    edge = (node1, node2) 

    result = generate_backprop_math(edge)
    return jsonify({"expression": result})

@app.route('/expand_math', methods=['GET'])
def get_math():
    gradient = request.args.get('gradient', default='default_value', type=str)
    a = request.args.get('a', default='0', type=str)
    print("Grad", gradient)
    print("a", a)
   
    gradient = gradient.replace('_{a', '_{' + str(int(a)))
    result = expand_math(gradient)

    print("result", result)
    return jsonify({"expression": result})


@app.route('/pull_matrices', methods=['GET'])
def get_matrices():
    layer_index = request.args.get('layer_index', default=0, type=int)
    is_weight_gradient = request.args.get('is_weight_gradient', default=False, type=bool)

    result = pull_gradient_values(layer_index, is_weight_gradient)
    
    return jsonify({"expression": result})


if __name__ == '__main__':
    app.run(debug=True)
