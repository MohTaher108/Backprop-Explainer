import re

def generate_backprop_formula(edge):
    src, dest = edge
    src_layer, src_node = src.split('_')
    dest_layer, dest_node = dest.split('_')

    formulas = {
        ('x', 'h1'): 1,
        ('h1', 'h2'): 2,
        ('h2', 'y'): 3,
    }

    edge_type = (src_layer, dest_layer)
    layer = formulas.get(edge_type)
    formula_parts = [
        f"\\frac{{\\partial L}}{{\\partial w_{{{src_node},{dest_node}}}^{{({layer})}}}}",
        f"= \\frac{{\\partial L}}{{\\partial n_{{{dest_node}}}^{{({layer})}}}}",
        f"\\cdot \\frac{{\\partial n_{{{dest_node}}}^{{({layer})}}}}{{\\partial w_{{{src_node},{dest_node}}}^{{({layer})}}}}",
    ]

    if not formula_parts:
        formula_parts = ["Invalid edge type or layer names."]

    return formula_parts

def generate_backprop_math(edge):
    src, dest = edge
    src_layer, src_node = src.split('_')
    dest_layer, dest_node = dest.split('_')

    formulas = {
        ('x', 'h1'): 1,
        ('h1', 'h2'): 2,
        ('h2', 'y'): 3,
    }

    edge_type = (src_layer, dest_layer)
    layer = formulas.get(edge_type)

    i = int(src_node)
    if i > 500: i = i - 778
    j = int(dest_node)
    if j > 500: j = j - 778
    final_value = [[0.003, -0.006, -0.002,  0.028,  0.008, -0.001,  0.05,   0.013,  0.002,  0.002, 0.003,  0.009],
                    [ 0.003, -0.006, -0.002,  0.028, 0.008, -0.001,  0.05,   0.013,  0.002,  0.002, 0.003,  0.009],
                    [ 0.003, -0.006, -0.002,  0.028,  0.008, -0.001,  0.05,   0.013,  0.002,  0.002, 0.003,  0.009],
                    [ 0.003, -0.006, -0.002,  0.028,  0.008, -0.001,  0.05,   0.013,  0.002,  0.002, 0.003,  0.009],
                    [ 0.003, -0.006, -0.002,  0.028,  0.008, -0.001,  0.05,   0.013,  0.002,  0.002, 0.003,  0.009],
                    [ 0.003, -0.006, -0.002,  0.028,  0.008, -0.001,  0.05,   0.013,  0.002,  0.002, 0.003,  0.009]][i][j]
    formula_parts = f"\\frac{{\\partial L}}{{\\partial n_{{{dest_node}}}^{{({layer})}}}} \\cdot \\frac{{\\partial n_{{{dest_node}}}^{{({layer})}}}}{{\\partial w_{{{src_node},{dest_node}}}^{{({layer})}}}} = {final_value}"

    if not formula_parts:
        formula_parts = ["Invalid edge type or layer names."]

    return formula_parts


def expand_formula(gradient):
    # formula 1: \\frac{{\\partial n_{j}^{{(k)}}}}{{\\partial w_{{{i},{j}}}^{{(k)}}}}
    # formula 2:  \\frac{{\\partial L}}{{\\partial n_{j}^{{(3)}}}}  main function for recursive visualization 
    # formula 3: \\frac{{\\partial n_{i}^{{(k + 1)}}}}{{\\partial n_{j}^{{({k})}}}
    print(gradient)
    # \frac{\partial L}{\partial n_2^{(1)}}

    print("HELLO MY FRIEND")

    # NEED TO PUT F FOR RELU, G FOR SIGMOID

    # case gradient = '\\frac{{\\partial L}}{{\\partial n_1^{{(2)}}}}'
    #pattern = r'\\frac\{\{\\partial L\}\}\{\{\\partial n_(\w+)\^\{\{\((\d+)\)\}\}\}'
    pattern = r'\\frac\{\\partial L\}\{\\partial n_\{(\w+)\}\^\{\((\d+)\)\}\}'
    match = re.search(pattern, gradient)
    if match:
        j, k = match.groups()
        return [
            gradient,
            f" = \\sum_{{a=0}}^{{L^{{({int(k)+1})}}}} \\frac{{\\partial L}}{{\\partial n_{{a}}^{{({int(k)+1})}}}}",
            f"\\cdot \\frac{{\\partial n_{{a}}^{{({int(k)+1})}}}}{{\\partial n_{{{j}}}^{{({k})}}}}",
        ]
    
    # case gradient = '\\frac{{\\partial n_4^{{(3)}}}}{{\\partial w_{{2, 5}}^{{(2)}}}}'
    #pattern = r'\\frac\{\{\\partial n_(\w+)\^\{\{\((\d+)\)\}\}\}\}\{\{\\partial w_\{\{(\w+), (\w+)\}\}\^\{\{\((\d+)\)\}\}\}\}'
    pattern = r'\\frac\{\\partial n_\{(\w+)\}\^\{\((\d+)\)\}\}\{\\partial w_\{(\w+),(\w+)\}\^\{\((\d+)\)\}\}'
    match = re.search(pattern, gradient)
    if match:
        j, k1, i1, i2, k2= match.groups()
        #print(f"Matched: j={j}, k1={k1}, i1={i1}, i2={i2}, k2={k2}")
        return [
            gradient,
            f"= n_{{{i1}}}^{{({int(k1) - 1})}}",
            f"\\cdot f(u_{{{j}}}^{{({k1})}})",
        ]

    #case gradient = "\\frac{{\\partial n_1^{{(2)}}}}{{\\partial n_3^{{(4)}}}}"
    pattern = r'\\frac\{\\partial n_\{(\w+)\}\^\{\((\d+)\)\}\}\{\\partial n_\{(\w+)\}\^\{\((\d+)\)\}\}'
    match = re.search(pattern, gradient)
    if match:
        i, k1, j, k = match.groups()
        return [
            gradient,
            f"= w_{{{j}, {i}}}^{{({k1})}}",
            f"\\cdot f(u_{{{j}}}^{{({k1})}})"
        ]

    return []

def last_layer(grad):
    print(grad)
    grad_list = grad.split('\\frac{\\partial n')
    pattern = r'\\frac\{\\partial L\}\{\\partial n_\{(\w+)\}\^\{\((\d+)\)\}\} \\frac\{\\partial n_\{(\w+)\}\^\{\((\d+)\)\}\}\{\\partial n_\{(\w+)\}\^\{\((\d+)\)\}\}'
    match = re.search(pattern, grad)
    if match:
        i, l, _, l1, j, lm  = match.groups()
        return [
            f"{grad_list[0]} \\cdot \\frac{{\\partial n{grad_list[1]} = (\\hat{{y}}_{{{i}}} - y_{{{i}}}) \\cdot w_{{{j},{i}}}^{{({l})}}"
        ]
    

def expand_math(gradient):
    # case gradient = '\\frac{{\\partial L}}{{\\partial n_1^{{(2)}}}}'
    # pattern = r'\\frac\{\{\\partial L\}\}\{\{\\partial n_(\w+)\^\{\{\((\d+)\)\}\}\}'
    pattern = r'\\frac\{\\partial L\}\{\\partial n_\{(\w+)\}\^\{\(2\)\}\}'
    match = re.search(pattern, gradient)
    if match:
        return [
            # "asd"
            "\\frac{\\partial L}{\\partial n^{(3)}} \\cdot \\frac{\\partial n^{(3)}}{\\partial n^{(2)}} = \\begin{bmatrix} \\frac{\\partial L}{\\partial u^{(3)}_1} \\\\ \\frac{\\partial L}{\\partial u^{(3)}_2} \\\\ \\vdots \\\\ \\frac{\\partial L}{\\partial u^{(3)}_{L^{(3)}}} \\end{bmatrix} \\times \\begin{bmatrix} \\frac{\\partial u^{(3)}_1}{\\partial n^{(2)}_1} & \\frac{\\partial u^{(3)}_1}{\\partial n^{(2)}_2} & ... & \\frac{\\partial u^{(3)}_1}{\\partial n^{(2)}_{L^{(2)}}} \\\\ \\frac{\\partial u^{(3)}_2}{\\partial n^{(2)}_1} & \\frac{\\partial u^{(3)}_2}{\\partial n^{(2)}_2} & & \\vdots \\\\ \\vdots & & \\ddots & \\vdots \\\\ \\frac{\\partial u^{(3)}_{L^{(3)}}}{\\partial n^{(2)}_1} & ... & ... & \\frac{\\partial u^{(3)}_{L^{(3)}}}{\\partial n^{(2)}_{L^{(2)}}} \\end{bmatrix} = \\begin{bmatrix} -0.272 \\\\ -0.023 \\\\ -0.107 \\\\ -0.114 \\\\ 0.176 \\\\ 0.102 \\\\ 0.122 \\\\ -0.126 \\\\ -0.004 \\\\ 0.007 \\\\ -0.008 \\\\ 0.104 \\end{bmatrix}"
        ]
    
    # case gradient = '\\frac{{\\partial L}}{{\\partial n_1^{{(2)}}}}'
    # pattern = r'\\frac\{\{\\partial L\}\}\{\{\\partial n_(\w+)\^\{\{\((\d+)\)\}\}\}'
    pattern = r'\\frac\{\\partial L\}\{\\partial n_\{(\w+)\}\^\{\(1\)\}\}'
    match = re.search(pattern, gradient)
    if match:
        a = match.groups()[0]
        final_value = [0.003, -0.062, -0.016, 0.028, 0.008, -0.001, 0.05, 0.013, 0.002, 0.024, 0.027, 0.009][int(a)]
        return [
            f"\\frac{{\\partial L}}{{\\partial n^{{(2)}}}} \\cdot \\frac{{\\partial n^{{(2)}}}}{{\\partial n_{{{a}}}^{{(1)}}}} = \\begin{{bmatrix}} \\frac{{\\partial L}}{{\\partial n^{{(2)}}_1}} \\\\ \\frac{{\\partial L}}{{\\partial n^{{(2)}}_2}} \\\\ \\vdots \\\\ \\frac{{\\partial L}}{{\\partial n^{{(2)}}_{{L^{{(2)}}}}}} \\end{{bmatrix}} \\times \\begin{{bmatrix}} \\frac{{\\partial n^{{(2)}}_1}}{{\\partial n_{{{a}}}^{{(1)}}}} \\\\ \\frac{{\\partial n^{{(2)}}_2}}{{\\partial n_{{{a}}}^{{(1)}}}} \\\\ \\vdots \\\\ \\frac{{\\partial n^{{(2)}}_{{L^{{(2)}}}}}}{{\\partial n_{{{a}}}^{{(1)}}}} \\end{{bmatrix}} = {final_value}"
        ]

    return []



# gradient = '\\frac{{\\partial L}}{{\\partial n_{{1}}^{{(3)}}}}'
# pattern = r'\\frac\{\\partial L\}\{\\partial n_\{(\w+)\}\^\{\(3\)\}\}'
# match = re.search(pattern, gradient)
# print(match)
# for x in expand_formula(gradient):
#     print(x)


# print(x for x in generate_backprop_formula(('x_1', 'h1_1')))


# grad = '\\frac{\\partial n_3^{(1)}}{\\partial w_{2,3}^{(1)}}'
# print(expand_formula(gradient))

# print(expand_math(gradient))