(function () {
  const elements = {
    input: document.getElementById('json-input'),
    render: document.getElementById('render-btn'),
    sample: document.getElementById('sample-btn'),
    clear: document.getElementById('clear-btn'),
    error: document.getElementById('error-message'),
    summary: document.getElementById('data-summary'),
    tableContainer: document.getElementById('table-container'),
  };

  const sampleData = [
    {
      id: 101,
      name: 'Olivia Stone',
      email: 'olivia.stone@example.com',
      role: 'Product Manager',
      active: true,
      tags: ['beta', 'feedback'],
      profile: {
        team: 'Aurora',
        lastLogin: '2024-05-12T09:42:00Z',
      },
    },
    {
      id: 102,
      name: 'Jasper Cole',
      email: 'jasper.cole@example.com',
      role: 'Data Analyst',
      active: false,
      tags: ['segment-a'],
      profile: {
        team: 'Nebula',
        lastLogin: '2024-05-05T18:15:00Z',
      },
    },
    {
      id: 103,
      name: 'Maya Lin',
      email: 'maya.lin@example.com',
      role: 'Customer Success',
      active: true,
      tags: [],
      profile: {
        team: 'Aurora',
        lastLogin: null,
      },
    },
  ];

  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  };

  const createTableFromObjects = (rows) => {
    const columnSet = new Set();
    rows.forEach((row) => {
      Object.keys(row || {}).forEach((key) => columnSet.add(key));
    });
    const columns = Array.from(columnSet);

    if (columns.length === 0) {
      return createEmptyState('Objects do not contain any properties to display.');
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    columns.forEach((column) => {
      const th = document.createElement('th');
      th.textContent = column;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    rows.forEach((row, index) => {
      const tr = document.createElement('tr');
      columns.forEach((column) => {
        const td = document.createElement('td');
        const value = row ? row[column] : undefined;
        td.textContent = formatValue(value);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
  };

  const createTableFromArray = (rows) => {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    ['Index', 'Value'].forEach((label) => {
      const th = document.createElement('th');
      th.textContent = label;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    rows.forEach((item, index) => {
      const tr = document.createElement('tr');
      const indexCell = document.createElement('td');
      indexCell.textContent = index;
      const valueCell = document.createElement('td');
      valueCell.textContent = formatValue(item);
      tr.appendChild(indexCell);
      tr.appendChild(valueCell);
      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
  };

  const createKeyValueTable = (obj) => {
    const entries = Object.entries(obj || {});
    if (!entries.length) {
      return createEmptyState('Object does not contain any properties to display.');
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    ['Key', 'Value'].forEach((label) => {
      const th = document.createElement('th');
      th.textContent = label;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    entries.forEach(([key, value]) => {
      const tr = document.createElement('tr');
      const keyCell = document.createElement('td');
      keyCell.textContent = key;
      const valueCell = document.createElement('td');
      valueCell.textContent = formatValue(value);
      tr.appendChild(keyCell);
      tr.appendChild(valueCell);
      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
  };

  const createEmptyState = (message) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'empty-state';
    wrapper.textContent = message;
    return wrapper;
  };

  const renderTable = () => {
    resetMessages();
    const raw = elements.input.value.trim();

    if (!raw) {
      showError('Please paste some JSON to render.');
      elements.tableContainer.replaceChildren(createEmptyState('No data loaded yet.'));
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      showError(`Could not parse JSON: ${error.message}`);
      elements.tableContainer.replaceChildren(createEmptyState('Invalid JSON input.'));
      return;
    }

    let table;
    let summary;

    if (Array.isArray(parsed)) {
      const isArrayOfObjects = parsed.every(
        (item) => typeof item === 'object' && item !== null && !Array.isArray(item)
      );

      if (isArrayOfObjects) {
        table = createTableFromObjects(parsed);
        const columnCount = table.tagName === 'TABLE' ? table.querySelectorAll('thead th').length : 0;
        summary = `Displaying ${parsed.length} row${parsed.length === 1 ? '' : 's'} with ${columnCount} column${
          columnCount === 1 ? '' : 's'
        }.`;
      } else {
        table = createTableFromArray(parsed);
        summary = `Displaying ${parsed.length} entr${parsed.length === 1 ? 'y' : 'ies'} from an array.`;
      }
    } else if (typeof parsed === 'object' && parsed !== null) {
      table = createKeyValueTable(parsed);
      summary = 'Displaying key-value pairs from an object.';
    } else {
      table = createTableFromArray([parsed]);
      summary = 'Displaying a single value.';
    }

    elements.tableContainer.replaceChildren(table);
    if (summary) {
      showSummary(summary);
    }
  };

  const showError = (message) => {
    elements.error.textContent = message;
    elements.summary.textContent = '';
  };

  const showSummary = (message) => {
    elements.summary.textContent = message;
    elements.error.textContent = '';
  };

  const resetMessages = () => {
    elements.error.textContent = '';
    elements.summary.textContent = '';
  };

  const loadSample = () => {
    elements.input.value = JSON.stringify(sampleData, null, 2);
    elements.input.focus();
    renderTable();
  };

  const clearInput = () => {
    elements.input.value = '';
    elements.tableContainer.replaceChildren(createEmptyState('No data loaded yet.'));
    resetMessages();
    elements.input.focus();
  };

  const init = () => {
    elements.render.addEventListener('click', renderTable);
    elements.sample.addEventListener('click', loadSample);
    elements.clear.addEventListener('click', clearInput);
    elements.input.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        renderTable();
      }
    });

    clearInput();
  };

  document.addEventListener('DOMContentLoaded', init);
})();
