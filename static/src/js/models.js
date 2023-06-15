odoo.define('extra_product_pos.models', function (require) {
    "use strict";

    const { PosGlobalState, Order, Orderline } = require('point_of_sale.models');
    const PartnerListScreen = require('point_of_sale.PartnerListScreen');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { Gui } = require('point_of_sale.Gui');
    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');

    const { useListener } = require("@web/core/utils/hooks");
    const { useState } = owl;


    const ExtraProductPosPosGlobalState = (PosGlobalState) => class ExtraProductPosPosGlobalState extends PosGlobalState {
        async _processData(loadedData) {
            await super._processData(...arguments);
            this.extra_products_loaded_data = {};
            this.extra_products = {}
            console.log(loadedData)

            this.extra_products = loadedData['extra_product_pos.extra'];
            console.log(' EXTRAS LOAD')
            console.log(this.extra_products)
            // console.log(this.extra_lists_p)
        }
        add_new_order() {
            var new_order = super.add_new_order(...arguments);
            console.log('new order')
            return new_order;
        }

    };
    Registries.Model.extend(PosGlobalState, ExtraProductPosPosGlobalState);

    class ExtraButton extends PosComponent {
        setup() {
            super.setup();
            useListener('click', this.onClick);
            const order = this.env.pos.get_order();

        }
        async onClick() {
          var order = this.env.pos.get_order();
          var product = false;
          var extra_products = this.env.pos.extra_products;

          if (order.get_selected_orderline()) {
            var line = order.get_selected_orderline();
            var extras = line.product.extra_product_ids
            var list =  [];

            for (const extra of extras) {
              for (const p of extra_products) {
                if (p['id'] == extra){
                  console.log('es igual')
                  console.log(p)
                  var data = {
                    id: p.product_product_id[1],
                    label: p.product_product_id[1] + " ( "+ this.env.pos.format_currency(p.price)+" )",
                    isSelected: false,
                    item: p,
                  }
                  list.push(data);
                }
              };
            };

            const { confirmed, payload } = await Gui.showPopup('SelectionPopup', {
                'title': 'Extras',
                'list': list
            });


            if (confirmed) {
                var product_id = payload.product_product_id[0];
                var price = payload.price
                var extra_product_db = this.env.pos.db.get_product_by_id(product_id);
                order.add_product(extra_product_db, { price: price, quantity: 1, extras: { price_manually_set: true } });

            }
          }

        }

        // async get_product_list_extras(extras, extra_products){
        //   const list = [];
        //   for (const extra of extras) {
        //     for (const p of extra_products) {
        //       if (p['id'] == extra){
        //         console.log('es igual')
        //         console.log(p)
        //         var data = {
        //           id: p.product_product_id[1],
        //           label: p.product_product_id[1] + " ( "+ this.env.pos.format_currency(p.price)+" )",
        //           isSelected: false,
        //           item: p,
        //         }
        //         list.push(data);
        //       }
        //     };
        //   };
        //
        //   return list
        // }
    }
    ExtraButton.template = 'ExtraButton';

    ProductScreen.addControlButton({
        component: ExtraButton,
    });
    Registries.Component.add(ExtraButton);

});
