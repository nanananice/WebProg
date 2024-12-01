const fileInput = document.getElementById("fileInput");

        fileInput.addEventListener("change", function () {
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = function (event) {
                const jsonData = JSON.parse(event.target.result);

                document.getElementById("student_name").value = jsonData.student_name;
                document.getElementById("date_of_birth").value = jsonData.date_of_birth;
                document.getElementById("student_id").value = jsonData.student_id;
                document.getElementById("date_of_admission").value = jsonData.date_of_admission;
                document.getElementById("date_of_graduation").value = jsonData.date_of_graduation;
                document.getElementById("degree").value = jsonData.degree;
                document.getElementById("major").value = jsonData.major;

                // Populate the table with course data
                const contentBody = document.getElementById("content_body");
                contentBody.innerHTML = ''; // Clear existing rows

                for (const year in jsonData.credit) {
                    for (const semester in jsonData.credit[year]) {
                        jsonData.credit[year][semester].forEach(course => {
                            const row = document.createElement("tr");
                            const titleCell = document.createElement("td");
                            const creditCell = document.createElement("td");
                            const gradeCell = document.createElement("td");

                            titleCell.textContent = course.name;
                            creditCell.textContent = course.credit;
                            gradeCell.textContent = course.grade;

                            row.appendChild(titleCell);
                            row.appendChild(creditCell);
                            row.appendChild(gradeCell);
                            contentBody.appendChild(row);
                        });
                    }
                }
            };

            reader.readAsText(file);
        });