Ext.define('Ext.ux.TextFieldAjaxValidation', {
    extend:'Ext.form.field.Text',
    require:['Ext.Ajax'],
    alias:'widget.textfield_ajaxvalid',

    /**
     * url where send the request
     */
    url:'',

    /**
     * error string from server
     */
    ajax_error:'',

    /**
     * the field to controll for the response in json
     * the returned value must be boolean
     * {
     *     success:true,
     *     valis:true/false
     *     error:''
     * }
     */
    fieldControll:'valid',

    /**
     * the function to use for validation,
     * it receiv the value
     */
    validator:Ext.emptyFn(),

    /**
     * attribute that memory the valid state of the element
     */
    asyncvalid:true,

    isAjaxValid:function () {
        return this.asyncvalid;
    },
    setValid:function (val) {
        this.asyncvalid = val;
    },
    /**
     * attribute to memory the state of the asyncron controll
     */
    inControll:false,
    _ajaxRequest:null,
    isControling:function () {
        return this.inControll && this._ajaxRequest == null;
    },
    setControlling:function (con) {
        this.inControll = con;
    },
    clearControll:function () {
        this.inControll = false;
        if (this._ajaxRequest != null) {
            Ext.Ajax.abort(this._ajaxRequest);
            this._ajaxRequest = null;
        }
    },

    name:'code',
    fieldLabel:'Codice',
    anchor:'100%',
    enableKeyEvents:true,

    initComponent:function () {
        var me = this;

        Ext.applyIf(me, {
            url:'',
            allowBlank:false,
            validator:function (value) {
                return this.isAjaxValid() ? true : this.ajax_error
            }
        });

        me.callParent(arguments);
        me.addEvents(
            /**
             * Event ajaxComplete
             * return this,result of control, full returned data package
             */
            'ajaxComplete');

        me.addListener('keyup', function (field) {
            field.setValid(false);
            field.clearControll();
            field.setControlling(true);
            Ext.Ajax.request({
                url:field.url,
                params:{
                    value:field.getValue()
                },
                success:function (response) {
                    data = Ext.decode(response.responseText);
                    this.setValid(data[this.fieldControll]);
                    if (typeof data.error != 'undefined') {
                        this.ajax_error = data.error;
                    }
                    this.clearControll();
                    this.validate();
                    this.fireEvent('ajaxComplete', this, data[this.fieldControll], data);
                },
                scope:field
            });

        });
    }
})
;