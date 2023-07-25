odoo.define('extra_product_pos.models', function (require) {
    "use strict";

    const { PosGlobalState, Order, Orderline } = require('point_of_sale.models');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { Gui } = require('point_of_sale.Gui');
    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');
    const { useListener } = require("@web/core/utils/hooks");

    const ExtraProductPosPosGlobalState = (PosGlobalState) => class ExtraProductPosPosGlobalState extends PosGlobalState {
        async _processData(loadedData) {
            await super._processData(...arguments);
            this.extra_products_loaded_data = {};
            this.extra_products = {}
            this.extra_products = loadedData['extra_product_pos.extra'];
        }
        add_new_order() {
            var new_order = super.add_new_order(...arguments);
            return new_order;
        }

    };
    Registries.Model.extend(PosGlobalState, ExtraProductPosPosGlobalState);

    const ExtraProductoOrder = (Order) => class ExtraProductoOrder extends Order {
      constructor(obj, options) {
          super(...arguments);
      }

      async show_popup(list, line){
        const { confirmed, payload } = await Gui.showPopup('SelectionPopup', {
            'title': 'Extras',
            'list': list
        });

        if (confirmed) {
            var product_id = payload.product_product_id[0];
            var price = payload.price
            var extra_product_db = this.pos.db.get_product_by_id(product_id);
            // order.add_product(extra_product_db, { price: price, quantity: 1, extras: { price_manually_set: true } });
            var note = extra_product_db.display_name
            // line.set_customer_note(note)
            line.set_note(note)
            
        }

      }
      add_product(product, options) {
          var order = this;
          var product_order = false;
          var extra_products = this.pos.extra_products;
          super.add_product(...arguments);
          var line = order.get_selected_orderline();
          var extras = product.extra_product_ids;
          var list =  [];

          if (product.show_auto_screen == true){
            for (const extra of extras) {
              for (const p of extra_products) {
                if (p['id'] == extra && p['note'] == true){
                  var data = {
                    id: p.product_product_id[1],
                    label: p.product_product_id[1] + " ( "+ this.pos.format_currency(p.price)+" )",
                    isSelected: false,
                    item: p,
                  }
                  list.push(data);
                }
              };
            };

            this.show_popup(list, line);
          }
      }
    }

    Registries.Model.extend(Order, ExtraProductoOrder);

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
                if (p['id'] == extra && p['note'] == false){
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

    }
    ExtraButton.template = 'ExtraButton';

    ProductScreen.addControlButton({
        component: ExtraButton,
    });
    Registries.Component.add(ExtraButton);

});
