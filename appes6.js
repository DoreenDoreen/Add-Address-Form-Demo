class Address {
  constructor(street, state, city) {
    this.street = street;
    this.state = state;
    this.city = city;
  }
}

class UI {
  addAddressToList(address) {
    const list = document.getElementById('address-list');
    // Create tr element
    const row = document.createElement('tr');
    // Insert cols
    row.innerHTML = `
      <td>${address.street}</td>
      <td>${address.state}</td>
      <td>${address.city}</td>
      <td><a href="#" class="delete">X</a></td>
      `;
    list.appendChild(row);
  }

  showAlert(message, className) {
    // Create div
    const div = document.createElement('div');
    // Add Classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector('.container');
    // Get form
    const form = document.querySelector('#address-form');
    // Insert alert
    container.insertBefore(div, form);

    // Timeout after 3 sec
    setTimeout(function(){
      document.querySelector('.alert').remove();
    }, 3000);
  }

  deleteAddress(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById('street').value = '';
    document.getElementById('state').value = '';
    document.getElementById('city').value = '';
  }
}

// Local Storage class
class Store {
  static getAddresses() {
    let addresses;
    if (localStorage.getItem('addresses') === null) {
      addresses = [];
    } else {
      addresses = JSON.parse(localStorage.getItem('addresses'));
    }
    return addresses;
  }

  static displayAddresses() {
    const addresses = Store.getAddresses();

    addresses.forEach(function(address){
      const ui = new UI;

      // Add address to UI
      ui.addAddressToList(address);
    });
  }

  static addAddress(address) {
    const addresses = Store.getAddresses();

    addresses.push(address);

    localStorage.setItem('addresses', JSON.stringify(addresses));
  }

  static removeAddress(city) {
    const addresses = Store.getAddresses();
    addresses.forEach(function(address, index){
      if (address.city === city) {
        addresses.splice(index, 1);
      }
    });

    localStorage.setItem('addresses', JSON.stringify(addresses));
  }
}

// DOM load Event
document.addEventListener('DOMContentLoaded', Store.displayAddresses);

// Event Listener for add address
document.getElementById('address-form').addEventListener('submit', function(e){
  // get form values
  const street = document.getElementById('street').value,
        state = document.getElementById('state').value,
        city = document.getElementById('city').value;

  // Instantiate Address object
  const address = new Address(street, state, city);

  // Instantiate UI
  const ui = new UI();

  // Validate
  if (street === '' || state === '' || city === '') {
    // Error alert
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    // Add address to list
    ui.addAddressToList(address);

    // Add to LS
    Store.addAddress(address); 

    // Show success
    ui.showAlert('Address Added!', 'success');

    // Clear UI fields
    ui.clearFields();
  }

  e.preventDefault();
});

// Event Listener for delete
document.getElementById('address-list').addEventListener('click', function(e) {
  // Instantiate UI
  const ui = new UI();

  // Delete address
  ui.deleteAddress(e.target);

  // Remove from LS
  Store.removeAddress(e.target.parentElement.previousElementSibling.textContent);

  // Show message
  ui.showAlert('Address Remove!', 'success');

  e.preventDefault();
})