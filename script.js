const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('monthYear');
let date = new Date();

function renderCalendar() {
  calendar.innerHTML = '';
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });

  for (let i = 0; i < firstDay; i++) {
    calendar.innerHTML += '<div></div>';
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement('div');
    dayCell.textContent = day;
    dayCell.className = 'p-2 bg-white rounded shadow text-center';
    calendar.appendChild(dayCell);
  }
}

document.getElementById('prev').onclick = () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
};

document.getElementById('next').onclick = () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
};

renderCalendar();
