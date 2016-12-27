function WiezmanConfigController() {
    var self = this;
    self.setNotification = function (s) {
        alert(s);
        self.alerts.push({ msg: s });
    }
    self.alerts = [
  { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
  { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ];

    self.test = { "d": "1" };
    //<<<<<
    function showData() {
        alert(111);
    }

    self.addAlert = function () {
        self.alerts.push({ msg: 'Another alert!' });
    };

    self.closeAlert = function (index) {
        self.alerts.splice(index, 1);
    };
}