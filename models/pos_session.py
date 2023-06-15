# -*- coding: utf-8 -*-

from odoo import api, fields, models, tools, _
import logging

class PosSession(models.Model):
    _inherit = 'pos.session'

    def _pos_ui_models_to_load(self):
        result = super()._pos_ui_models_to_load()
        new_model = 'extra_product_pos.extra'
        if new_model not in result:
            result.append(new_model)

        return result

    def _loader_params_extra_product_pos_extra(self):
        return {
            'search_params': {
                'domain': [('company_id', '=', self.config_id.company_id.id)],
                'fields': ['product_product_id', 'price','quantity','product_id'],
            },
        }

    def _get_pos_ui_extra_product_pos_extra(self, params):
        search_extra = self.env['extra_product_pos.extra'].search_read(**params['search_params'])
        return self.env['extra_product_pos.extra'].search_read(**params['search_params'])

    def _loader_params_product_product(self):
        result = super(PosSession, self)._loader_params_product_product()
        result['search_params']['fields'].append('extra_product_ids')
        return result
