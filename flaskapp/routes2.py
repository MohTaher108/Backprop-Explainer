from flask import Flask, render_template, request, jsonify
from latex_builder import LatexBuilder  # Import the LatexBuilder class

app = Flask(__name__)

latex_builder = LatexBuilder()

@app.route('/')
@app.route('/index')
def index():
    """Renders the index.html template"""
    return render_template('index.html')

@app.route('/latex_expression', methods=['GET'])
def get_latex_string():
    param = request.args.get('edge', default='default_value', type=str)
    paramlist = param.split('_')
    node1 = str(paramlist[1] + '_' + paramlist[2])
    node2 = str(paramlist[3] + '_' + paramlist[4])
    edge = (node1, node2) 
    
    result = latex_builder.generate_backprop_formula(edge)
    return jsonify({"expression": result})

@app.route('/expand', methods=['GET'])
def get_tooltip():
    gradient = request.args.get('gradient', default='default_value', type=str)
    a = request.args.get('a', default='0', type=str)
   
    if "sum" in gradient:
        isLastLayer = 'L^{(3)}' in gradient
        gradient = '\\frac' + '\\frac'.join(gradient.split('\\frac')[1:])
        gradient = gradient.replace('_{a', '_{' + str(int(a)))
        if isLastLayer:
            result = latex_builder.last_layer(gradient)
            return jsonify({"expression": result})

    gradient = gradient.replace('_{a', '_{' + str(int(a)))
    result = latex_builder.expand_formula(gradient)
    return jsonify({"expression": result})

@app.route('/latex_expression_math', methods=['GET'])
def get_latex_math():
    param = request.args.get('edge', default='default_value', type=str)
    paramlist = param.split('_')
    node1 = str(paramlist[1] + '_' + paramlist[2])
    node2 = str(paramlist[3] + '_' + paramlist[4])
    edge = (node1, node2) 

    result = latex_builder.generate_backprop_math(edge)
    return jsonify({"expression": result})

@app.route('/expand_math', methods=['GET'])
def get_math():
    gradient = request.args.get('gradient', default='default_value', type=str)
    a = request.args.get('a', default='0', type=str)
   
    gradient = gradient.replace('_{a', '_{' + str(int(a)))
    result = latex_builder.expand_math(gradient)

    return jsonify({"expression": result})

@app.route('/pull_matrices', methods=['GET'])
def get_matrices():
    layer_index = request.args.get('layer_index', default=0, type=int)
    is_weight_gradient = request.args.get('is_weight_gradient', default=False, type=bool)

    result = latex_builder.pull_gradient_values(layer_index, is_weight_gradient)
    
    return jsonify({"expression": result})


if __name__ == '__main__':
    app.run(debug=True)
