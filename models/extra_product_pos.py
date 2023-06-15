# -*- coding: utf-8 -*-

from odoo import api, fields, models, tools, _


class ExtraProductPosExtra(models.Model):
    _name = "extra_product_pos.extra"

    product_id = fields.Many2one('product.template','Product')
    product_product_id = fields.Many2one('product.product','Product')
    quantity = fields.Float('Quantity')
    price = fields.Float('Price')
    company_id = fields.Many2one("res.company", string="Company", required=True, default=lambda self: self.env.user.company_id)
