# -*- coding: utf-8 -*-

from odoo import api, fields, models, tools, _


class ProductTemplate(models.Model):
    _inherit = "product.template"

    extra_product_ids = fields.One2many('extra_product_pos.extra','product_id',string='Extra product')
    show_auto_screen = fields.Boolean('Show auto screen')
