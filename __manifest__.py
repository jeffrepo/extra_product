# -*- coding: utf-8 -*-
{
    'name': "Extra product pos",
    'summary': """
        Extra producto for pos""",
    'description': """
       Add extra products in POS
    """,
    'author': "ST",
    'website': "",
    'category': 'Point of Sale',
    'version': '0.1',
    'depends': ['base','point_of_sale','product','stock'],
    'data': [
        'views/product_template_views.xml',
        'security/ir.model.access.csv',
    ],
    'demo': [
    ],
    'assets': {
        'point_of_sale.assets': [
            'extra_product_pos/static/src/js/**/*',
            'extra_product_pos/static/src/xml/**/*',
        ],
    },
    'installable': True,
    'aplication' : False,
}
