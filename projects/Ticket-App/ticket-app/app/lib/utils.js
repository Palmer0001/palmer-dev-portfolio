export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function generateProgress(status) {
  const progressMap = {
    'open': 0,
    'in progress': 50,
    'done': 100,
    'closed': 100,
    'resolved': 100,
  };
  return progressMap[status] || 0;
}