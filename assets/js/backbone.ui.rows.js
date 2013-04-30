// Backbone.js Rows extension
//
// Created by: Makis Tracend (@tracend)
// Source: https://github.com/backbone-ui/tags
//
// Licensed under the MIT license: 
// http://makesites.org/licenses/MIT

(function(_, Backbone) {
	
    // fallbacks
	if( _.isUndefined( Backbone.UI ) ) Backbone.UI = {};
	// Support backbone app (if available)
	var View = ( typeof APP != "undefined" && !_.isUndefined( APP.View) ) ? APP.View : Backbone.View;
    
	Backbone.UI.Rows = View.extend({
        
        options: {
            field: false,
            itemEl: false
        }, 
        
		//el : ".backend-container", 
		events : {
			"click .del a" : "_deleteRow", 
			"click .add" : "_addRow" 
			//"change .row-new select" : "_newRow"
		},
        
		initialize: function( options ){
			//fallbacks
			options || (options = {});
			_.bindAll( this, 'render', 'addRow', 'deleteRow', '_addRow', '_deleteRow', '_newRow', '_parseField', '_updateField');
			// always create the data
            this.data = new Rows();
            // assume the right structure
            if( options.data ) this.data.add( options.data );
            // 
            this.$field = ( options.field ) ? $(options.field) : false;
            // 
            if( this.$field ) this._parseField();
            // bindings
            this.data.on("add", this.render );
			this.data.on("remove", this.render );
			return View.prototype.initialize.call( this, options );
		},
        
        // Public functions
        
        // override with your own method for additional clean up...
        addRow: function( item ){
            return item;
        },
        
        deleteRow: function( e ){
            return item;
        },
        
        // Private functions
        
		_addRow: function( e ){
			var $el = $(this.el).find(".row-new");
            var item = {};
            
            $el.find("input,select").each(function(){
                var key = $(this).attr("name");
                var value = $(this).val();
                item[key] = value;
            });
            // further modifications (by the app)
            item = this.addRow( item );
            this._newRow( item );
            // update data
            // reset input fields
			$el.find("input").val("");
			$el.find("select").val(0);
		}, 
        
		_deleteRow: function( e ){
			e.preventDefault();
			// find tag
			var tag = $(e.target).closest(".row");
			// remove tag
			$(this.el).find(tag).remove();
            // update data
            var id = tag.attr("data-id")
            if( id ){
                this.data.remove( id );
            }
			// update input field
			this._updateField();
		}, 
        
        // custom method to "hack in" a new row when full page rendering is not 
		_newRow: function( item ){
            // update data
            this.data.add(item);
			this._updateField();
		}, 
        
        _parseField: function(){
            if( !this.$field ) return;
            var rows = this.$field.val() || false;
            if(!rows || _.isEmpty(rows)) return;
            var models = JSON.parse( rows );
            this.data.add( models );
        }, 
        
		_updateField: function(){
            if( !this.$field ) return;
			var data = this.data.toJSON();
            // cleanup the set ids
            data = _.map( data, function( row ){
                    delete row.id
                    return row;
                });
            console.log( data );
            // make a string from the data
			var rows = JSON.stringify( data );
			// update input (hidden) field
			this.$field.val( rows );
		} 
        
	});
    
    // Internal data containers
    var Row = Backbone.Model.extend({
        defaults :{
            // you define the model structure with the objects you are passing...
        },
        initialize: function( model ){
            // use cid's for ids
            if( !model.id )
                this.set({ id : this.cid });
        }
    });
    
    Rows = Backbone.Collection.extend({
        model: Row, 
    });
    
    
})(this._, this.Backbone);