document.addEventListener('DOMContentLoaded', () => {
  // Set CSRF token for Axios
  axios.defaults.xsrfCookieName = 'csrftoken';
  axios.defaults.xsrfHeaderName = 'X-CSRFToken';

  // Store token from template (passed from view)
  const tokenElement = document.getElementById('auth-token');
  if (tokenElement) {
    sessionStorage.setItem('auth_token', tokenElement.value);
  } else {
    console.error('Token element not found');
  }
  const token = sessionStorage.getItem('auth_token');

  // Load data for tables
  async function loadTableData(endpoint, tableId, fields) {
    if (!token) {
      console.error('No auth token found, skipping request to', endpoint);
      return;
    }
    try {
      const response = await axios.get(`/api/${endpoint}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      const tbody = document.getElementById(tableId);
      if (!tbody) {
        console.error(`Table with ID ${tableId} not found`);
        return;
      }
      tbody.innerHTML = '';
      response.data.forEach(item => {
        const row = document.createElement('tr');
        fields.forEach(field => {
          const cell = document.createElement('td');
          cell.textContent = item[field] || ''; // Handle null/undefined fields
          row.appendChild(cell);
        });
        const actionsCell = document.createElement('td');
        actionsCell.innerHTML = `
          <button class="btn btn-sm btn-primary edit-btn" data-id="${item.id}" data-endpoint="${endpoint}">Modificar</button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${item.id}" data-endpoint="${endpoint}">Eliminar</button>
        `;
        row.appendChild(actionsCell);
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error(`Error loading data from ${endpoint}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }
  }

  // Users Form
  const usersForm = document.getElementById('usersForm');
  if (usersForm) {
    usersForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(usersForm);
      const userId = usersForm.dataset.editId; // Store ID for editing
      const method = userId ? 'put' : 'post';
      const url = userId ? `/api/users/${userId}/` : '/api/users/';

      // Validate password for new users
      if (!userId && !formData.get('password')) {
        alert('La contraseña es requerida para nuevos usuarios.');
        return;
      }

      try {
        await axios({
          method,
          url,
          data: {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password') || undefined // Avoid sending empty password on update
          },
          headers: { Authorization: `Token ${token}` }
        });
        loadTableData('users', 'usersTable', ['username', 'email']);
        bootstrap.Modal.getInstance(document.getElementById('usersModal')).hide();
        usersForm.reset();
        delete usersForm.dataset.editId; // Clear edit ID
        // Reset modal title and button text
        document.querySelector('#usersModal .modal-title').textContent = 'Agregar usuario';
        usersForm.querySelector('button[type="submit"]').textContent = 'Guardar';
      } catch (error) {
        let errorMessage = 'Error guardando usuario: ';
        if (error.response?.data) {
          if (error.response.data.username) {
            errorMessage += error.response.data.username.join(' ');
          } else if (error.response.data.email) {
            errorMessage += error.response.data.email.join(' ');
          } else if (error.response.data.non_field_errors) {
            errorMessage += error.response.data.non_field_errors.join(' ');
          } else {
            errorMessage += JSON.stringify(error.response.data);
          }
        } else {
          errorMessage += error.message || 'Error desconocido';
        }
        alert(errorMessage);
        console.error('Error saving user:', error.response?.data);
      }
    });
    loadTableData('users', 'usersTable', ['username', 'email']);
  }

  // Clients Form
  const clientsForm = document.getElementById('clientsForm');
  if (clientsForm) {
    clientsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(clientsForm);
      const clientId = clientsForm.dataset.editId;
      const method = clientId ? 'put' : 'post';
      const url = clientId ? `/api/clients/${clientId}/` : '/api/clients/';
      try {
        await axios({
          method,
          url,
          data: {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address')
          },
          headers: { Authorization: `Token ${token}` }
        });
        loadTableData('clients', 'clientsTable', ['name', 'email', 'phone', 'address']);
        bootstrap.Modal.getInstance(document.getElementById('clientsModal')).hide();
        clientsForm.reset();
        delete clientsForm.dataset.editId;
      } catch (error) {
        let errorMessage = 'Error guardando cliente: ';
        if (error.response?.data) {
          if (error.response.data.email) {
            errorMessage += error.response.data.email.join(' ');
          } else if (error.response.data.non_field_errors) {
            errorMessage += error.response.data.non_field_errors.join(' ');
          } else {
            errorMessage += JSON.stringify(error.response.data);
          }
        } else {
          errorMessage += error.message || 'Error desconocido';
        }
        alert(errorMessage);
        console.error('Error saving client:', error.response?.data);
      }
    });
    loadTableData('clients', 'clientsTable', ['name', 'email', 'phone', 'address']);
  }

  // Products Form
  const productsForm = document.getElementById('productsForm');
  if (productsForm) {
    productsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(productsForm);
      const productId = productsForm.dataset.editId;
      const method = productId ? 'put' : 'post';
      const url = productId ? `/api/products/${productId}/` : '/api/products/';
      try {
        await axios({
          method,
          url,
          data: {
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            category: formData.get('category')
          },
          headers: { Authorization: `Token ${token}` }
        });
        loadTableData('products', 'productsTable', ['name', 'description', 'price', 'category']);
        bootstrap.Modal.getInstance(document.getElementById('productsModal')).hide();
        productsForm.reset();
        delete productsForm.dataset.editId;
      } catch (error) {
        let errorMessage = 'Error guardando producto: ';
        if (error.response?.data) {
          if (error.response.data.name) {
            errorMessage += error.response.data.name.join(' ');
          } else if (error.response.data.non_field_errors) {
            errorMessage += error.response.data.non_field_errors.join(' ');
          } else {
            errorMessage += JSON.stringify(error.response.data);
          }
        } else {
          errorMessage += error.message || 'Error desconocido';
        }
        alert(errorMessage);
      }
    });
    loadTableData('products', 'productsTable', ['name', 'description', 'price', 'category']);
  }

  // Inventory Form
  const inventoryForm = document.getElementById('inventoryForm');
  if (inventoryForm) {
    // Populate products dropdown
    axios.get('/api/products/', {
      headers: { Authorization: `Token ${token}` }
    }).then(response => {
      const select = inventoryForm.querySelector('select[name="product"]');
      select.innerHTML = ''; // Clear existing options
      response.data.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        select.appendChild(option);
      });
    }).catch(error => {
      console.error('Error loading products for dropdown:', error.response?.data);
    });

    inventoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(inventoryForm);
      const inventoryId = inventoryForm.dataset.editId;
      const method = inventoryId ? 'put' : 'post';
      const url = inventoryId ? `/api/inventory/${inventoryId}/` : '/api/inventory/';
      try {
        await axios({
          method,
          url,
          data: {
            product: parseInt(formData.get('product')),
            quantity: parseInt(formData.get('quantity')),
            observations: formData.get('observations')
          },
          headers: { Authorization: `Token ${token}` }
        });
        loadTableData('inventory', 'inventoryTable', ['product_name', 'quantity', 'entry_date', 'observations']);
        bootstrap.Modal.getInstance(document.getElementById('inventoryModal')).hide();
        inventoryForm.reset();
        delete inventoryForm.dataset.editId;
      } catch (error) {
        let errorMessage = 'Error guardando producto: ';
        if (error.response?.data) {
          console.table(error.response.data)
          if (error.response.data.product) {
            errorMessage += error.response.data.product.join(' ');
          } else if (error.response.data.non_field_errors) {
            errorMessage += error.response.data.non_field_errors.join(' ');
          } else {
            errorMessage += JSON.stringify(error.response.data);
          }
        } else {
          errorMessage += error.message || 'Error desconocido';
        }
        alert(errorMessage);
      }
    });
    loadTableData('inventory', 'inventoryTable', ['product_name', 'quantity', 'entry_date', 'observations']);
  }

  // Edit and Delete functionality
  document.addEventListener('click', async (e) => {
    const target = e.target;
    const endpoint = target.dataset.endpoint;
    const id = target.dataset.id;

    if (target.classList.contains('edit-btn') && endpoint && id) {
      try {
        const response = await axios.get(`/api/${endpoint}/${id}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        const data = response.data;
        const modalId = `${endpoint}Modal`;
        const formId = `${endpoint}Form`;
        const form = document.getElementById(formId);

        // Populate form fields based on endpoint
        if (endpoint === 'users') {
          form.querySelector('[name="username"]').value = data.username;
          form.querySelector('[name="email"]').value = data.email;
          form.querySelector('[name="password"]').value = ''; // Clear password for edit
          // Update modal title and button text
          document.querySelector('#usersModal .modal-title').textContent = 'Editar usuario';
          form.querySelector('button[type="submit"]').textContent = 'Actualizar';
          // Make password field optional for edit
          form.querySelector('[name="password"]').removeAttribute('required');
        } else if (endpoint === 'clients') {
          form.querySelector('[name="name"]').value = data.name;
          form.querySelector('[name="email"]').value = data.email;
          form.querySelector('[name="phone"]').value = data.phone;
          form.querySelector('[name="address"]').value = data.address;
        } else if (endpoint === 'products') {
          form.querySelector('[name="name"]').value = data.name;
          form.querySelector('[name="description"]').value = data.description;
          form.querySelector('[name="price"]').value = data.price;
          form.querySelector('[name="category"]').value = data.category;
        } else if (endpoint === 'inventory') {
          form.querySelector('[name="product"]').value = data.product;
          form.querySelector('[name="quantity"]').value = data.quantity;
          form.querySelector('[name="observations"]').value = data.observations;
        }

        // Set edit ID on form
        form.dataset.editId = id;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
      } catch (error) {
        console.error('Edit error:', {
          endpoint,
          id,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
    }

    if (target.classList.contains('delete-btn') && endpoint && id) {
      // Store deletion details in the confirm button
      const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
      confirmDeleteBtn.dataset.endpoint = endpoint;
      confirmDeleteBtn.dataset.id = id;

      // Show confirmation modal
      const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
      deleteModal.show();
    }
  });

  // Handle delete confirmation
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
      const endpoint = confirmDeleteBtn.dataset.endpoint;
      const id = confirmDeleteBtn.dataset.id;
      const tableId = `${endpoint}Table`;
      const fields = {
        users: ['username', 'email'],
        clients: ['name', 'email', 'phone', 'address'],
        products: ['name', 'description', 'price', 'category'],
        inventory: ['product_name', 'quantity', 'entry_date', 'observations']
      }[endpoint];

      try {
        await axios.delete(`/api/${endpoint}/${id}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        // Hide confirmation modal
        bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide();
      } catch (error) {
        console.error('Delete error:', {
          endpoint,
          id,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        // Hide confirmation modal
        bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide();
      } finally {
        // Refresh table
        await loadTableData(endpoint, tableId, fields);
      }
    });
  }

  // Reset password field requirement when opening add user modal
  const addUserBtn = document.querySelector('button[data-bs-target="#usersModal"]');
  if (addUserBtn) {
    addUserBtn.addEventListener('click', () => {
      const passwordInput = usersForm.querySelector('[name="password"]');
      passwordInput.setAttribute('required', '');
    });
  }

  // Logout
  const handleLogout = () => {
    alert("Hola")
  }
});