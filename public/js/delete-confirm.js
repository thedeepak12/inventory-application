document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const deleteUrl = this.getAttribute('data-delete-url');
      const redirectUrl = this.getAttribute('data-redirect') || '/';
      
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 backdrop-blur-sm flex items-center justify-center shadow-lg p-4 z-50';
      
      modal.innerHTML = `
        <div class="bg-gray-800 border-gray-900 border-1 rounded-lg p-6 w-full max-w-md">
          <h3 class="text-xl text-white font-bold mb-4">Confirm Delete</h3>
          <p class="mb-4 text-white">Please enter the admin key to confirm deletion:</p>
          <input 
            type="password" 
            id="adminKeyInput" 
            class="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          >
          <div class="flex justify-end space-x-3">
            <button 
              id="cancelDelete" 
              class="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-500 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              id="confirmDelete" 
              class="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 cursor-pointer"
            >
              Delete
            </button>
          </div>
          <p id="errorMessage" class="text-red-500 mt-2 hidden">Invalid admin key. Please try again.</p>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      const adminKeyInput = modal.querySelector('#adminKeyInput');
      adminKeyInput.focus();
      
      modal.querySelector('#cancelDelete').addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      
      modal.querySelector('#confirmDelete').addEventListener('click', async () => {
        const adminKey = adminKeyInput.value.trim();
        
        if (!adminKey) {
          showError(modal, 'Please enter an admin key');
          return;
        }
        
        try {
          console.log('Sending DELETE request to:', deleteUrl);
          console.log('With admin key:', adminKey ? '*** (set)' : 'NOT SET');
          
          const response = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ ADMIN_KEY: adminKey })
          });
          
          console.log('Response status:', response.status);
          console.log('Response headers:', Object.fromEntries([...response.headers]));
          
          const responseText = await response.text();
          console.log('Response text:', responseText);
          
          let result;
          try {
            result = responseText ? JSON.parse(responseText) : {};
          } catch (e) {
            console.error('Failed to parse JSON response:', e);
            throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}...`);
          }
          
          console.log('Parsed response data:', result);
          
          if (response.ok) {
            window.location.href = redirectUrl;
          } else {
            showError(modal, result.message || `Error: ${response.status} ${response.statusText}`);
          }
        } catch (error) {
          console.error('Error:', error);
          showError(modal, `Error: ${error.message || 'An error occurred. Please try again.'}`);
        }
      });
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });
      
      document.addEventListener('keydown', function onEscape(e) {
        if (e.key === 'Escape') {
          document.body.removeChild(modal);
          document.removeEventListener('keydown', onEscape);
        }
      });
    });
  });
  
  function showError(modal, message) {
    const errorElement = modal.querySelector('#errorMessage');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    
    const adminKeyInput = modal.querySelector('#adminKeyInput');
    adminKeyInput.focus();
  }
});
