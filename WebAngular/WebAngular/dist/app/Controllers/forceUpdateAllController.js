function forceUpdateAllController() {
            var self = this;
            this.Title = "Wiezman Configuration";
            this.Precent = "Interest (Precent)";
            this.DueDate = "Due Date";
            debugger;
        
            self.Send = function () {
                debugger;
             
                self.test = self.parent.test.d;
                alert(self.test);
                self.parent.setNotification("lior");

            }
           
            
        }
       

