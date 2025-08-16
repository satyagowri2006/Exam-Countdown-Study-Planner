mermaid.initialize({ startOnLoad: false });

const examForm = document.getElementById("examForm");
const topicsContainer = document.getElementById("topicsContainer");
const flowchartDiv = document.getElementById("flowchart");
const previousPlansDiv = document.getElementById("previousPlans");
const addTopicBtn = document.getElementById("addTopic");

addTopicBtn.addEventListener("click", () => {
  const topicDiv = document.createElement("div");
  topicDiv.classList.add("topic");
  topicDiv.innerHTML = `
    <input type="text" class="topicName" placeholder="Topic Name" required>
    <input type="number" class="topicTime" placeholder="Time (hours)" required>
    <button type="button" class="addSubtopic">+ Subtopic</button>
    <div class="subtopics"></div>
  `;
  topicsContainer.appendChild(topicDiv);
});

topicsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("addSubtopic")) {
    const subtopicsDiv = e.target.nextElementSibling;
    const subDiv = document.createElement("div");
    subDiv.classList.add("subtopic");
    subDiv.innerHTML = `
      <input type="text" class="subtopicName" placeholder="Subtopic Name" required>
      <input type="number" class="subtopicTime" placeholder="Time (hours)" required>
    `;
    subtopicsDiv.appendChild(subDiv);
  }
});

// Handle form submit
examForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const examName = document.getElementById("examName").value;
  const examDate = document.getElementById("examDate").value;

  let diagram = `graph TD;\n`;
  const examId = "exam" + Date.now().toString(36);
  diagram += `${examId}["${examName}<br>(${examDate})"];\n`;

  const topics = document.querySelectorAll(".topic");
  topics.forEach((topic, tIndex) => {
    const tName = topic.querySelector(".topicName").value;
    const tTime = topic.querySelector(".topicTime").value;
    const tId = `t${tIndex}_${examId}`;
    diagram += `${examId} --> ${tId}["${tName} (${tTime}h)"];\n`;

    const subtopics = topic.querySelectorAll(".subtopic");
    subtopics.forEach((sub, sIndex) => {
      const sName = sub.querySelector(".subtopicName").value;
      const sTime = sub.querySelector(".subtopicTime").value;
      const sId = `st${tIndex}_${sIndex}_${examId}`;
      diagram += `${tId} --> ${sId}["${sName} (${sTime}h)"];\n`;
    });
  });

  renderFlowchart(diagram);

  let savedPlans = JSON.parse(localStorage.getItem("studyPlans")) || [];
  savedPlans.push({ examName, examDate, diagram });
  localStorage.setItem("studyPlans", JSON.stringify(savedPlans));
  loadPrev
  examForm.reset();
  topicsContainer.innerHTML = `
    <h3>Study Topics</h3>
    <div class="topic">
      <input type="text" class="topicName" placeholder="Topic Name" required>
      <input type="number" class="topicTime" placeholder="Time (hours)" required>
      <button type="button" class="addSubtopic">+ Subtopic</button>
      <div class="subtopics"></div>
    </div>
  `;
});

function renderFlowchart(diagram) {
  flowchartDiv.innerHTML = `<div class="mermaid">${diagram}</div>`;
  mermaid.init(undefined, flowchartDiv.querySelectorAll(".mermaid"));
}

function loadPreviousPlans() {
  previousPlansDiv.innerHTML = "";
  const savedPlans = JSON.parse(localStorage.getItem("studyPlans")) || [];
  savedPlans.forEach((plan, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${plan.examName} (${plan.examDate})</strong>
      <button onclick="showPlan(${index})">Show</button>
      <button onclick="deletePlan(${index})">Delete</button>
    `;
    previousPlansDiv.appendChild(div);
  });
}

function showPlan(index) {
  const savedPlans = JSON.parse(localStorage.getItem("studyPlans")) || [];
  const plan = savedPlans[index];
  renderFlowchart(plan.diagram);
}

function deletePlan(index) {
  let savedPlans = JSON.parse(localStorage.getItem("studyPlans")) || [];
  savedPlans.splice(index, 1);
  localStorage.setItem("studyPlans", JSON.stringify(savedPlans));
  loadPreviousPlans();
}

loadPreviousPlans();
