document.querySelectorAll('.project').forEach(project => {
  const techIcons = project.querySelectorAll('i[class^="devicon-"]');
  
  project.addEventListener('mouseenter', () => {
      techIcons.forEach(icon => {
          const baseClass = icon.className.split(' ')[0];
          icon.classList.add('colored');
      });
  });
  
  project.addEventListener('mouseleave', () => {
      techIcons.forEach(icon => {
          icon.classList.remove('colored');
      });
  });
});