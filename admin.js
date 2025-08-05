document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated
    if (!sessionStorage.getItem('isAdmin')) {
        window.location.href = 'login.html';
    }

    const slotForm = document.getElementById('slot-form');
    const slotsTable = document.getElementById('slots-table');
    const cancelEditButton = document.getElementById('cancel-edit');

    // Load items from localStorage
    const loadItems = () => {
        return JSON.parse(localStorage.getItem('items')) || [];
    };

    // Save items to localStorage
    const saveItems = (items) => {
        localStorage.setItem('items', JSON.stringify(items));
    };

    // Render items table
    const renderItems = () => {
        const items = loadItems();
        slotsTable.innerHTML = '';
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.title}</td>
                <td>${item.description.substring(0, 50)}...</td>
                <td><a href="${item.image}" target="_blank">View</a></td>
                <td>${item.rtp || '-'}</td>
                <td>${item.rating || '-'}</td>
                <td data-i18n="items.${item.category}">${item.category}</td>
                <td>
                    <button class="text-neon-pink hover:text-neon-green" onclick="editItem('${item.id}')">Edit</button>
                    <button class="text-neon-pink hover:text-neon-green ml-2" onclick="deleteItem('${item.id}')">Delete</button>
                </td>
            `;
            slotsTable.appendChild(row);
        });
        // Re-apply localization to dynamic content
        applyLocalization();
    };

    // Handle form submission
    slotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const items = loadItems();
        const itemId = document.getElementById('item-id').value;
        const newItem = {
            id: itemId || Date.now().toString(),
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            image: document.getElementById('image').value,
            rtp: document.getElementById('category').value === 'strategy' ? null : parseFloat(document.getElementById('rtp').value),
            rating: document.getElementById('category').value === 'strategy' ? null : parseFloat(document.getElementById('rating').value),
            reviewLink: document.getElementById('reviewLink').value,
            category: document.getElementById('category').value
        };

        if (itemId) {
            // Update existing item
            const index = items.findIndex(item => item.id === itemId);
            items[index] = newItem;
        } else {
            // Add new item
            items.push(newItem);
        }

        saveItems(items);
        slotForm.reset();
        document.getElementById('item-id').value = '';
        cancelEditButton.classList.add('hidden');
        renderItems();
    });

    // Edit item
    window.editItem = (id) => {
        const items = loadItems();
        const item = items.find(item => item.id === id);
        if (item) {
            document.getElementById('item-id').value = item.id;
            document.getElementById('title').value = item.title;
            document.getElementById('description').value = item.description;
            document.getElementById('image').value = item.image;
            document.getElementById('rtp').value = item.rtp || '';
            document.getElementById('rating').value = item.rating || '';
            document.getElementById('reviewLink').value = item.reviewLink;
            document.getElementById('category').value = item.category;
            cancelEditButton.classList.remove('hidden');
        }
    };

    // Delete item
    window.deleteItem = (id) => {
        if (confirm('Are you sure you want to delete this item?')) {
            const items = loadItems().filter(item => item.id !== id);
            saveItems(items);
            renderItems();
        }
    };

    // Cancel edit
    cancelEditButton.addEventListener('click', () => {
        slotForm.reset();
        document.getElementById('item-id').value = '';
        cancelEditButton.classList.add('hidden');
    });

    // Initial render
    renderItems();
});