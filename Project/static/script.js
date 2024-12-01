    document.addEventListener("DOMContentLoaded", function () {
        const bodyDivs = document.querySelectorAll(".bodydiv");
        const bodyContainer = document.querySelector(".body-container");
        const pagination = document.querySelector(".pagination"); // Select the pagination container
        const leftButton = document.querySelector(".goleft"); // Select the left button
        const rightButton = document.querySelector(".goright"); 
        let currentIndex = 0;

        // Function to create pagination dots
        function createPaginationDots() {
            for (let i = 0; i < bodyDivs.length; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                pagination.appendChild(dot);
            }
        }

        // Call the function to create dots
        createPaginationDots();

        // Re-select all dots after they are created
        const dots = document.querySelectorAll(".dot");

        function updatePagination() {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots.length > 0) {
                dots[currentIndex].classList.add('active');
                dots[currentIndex+1].classList.add('active');
            }
        }

        function updateContainerTransform() {
            const offset = -(52 * currentIndex); // Adjusted for 100% width per set
            bodyContainer.style.transform = `translateX(${offset}%)`;
            updatePagination();
        }

        leftButton.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex -= 1;
                updateContainerTransform();
            }
        });

        rightButton.addEventListener('click', function() {
            if (currentIndex < bodyDivs.length - 2) { // Assuming 2 divs visible at a time
                currentIndex += 1;
                updateContainerTransform();
            }
        });

        function autoRotate() {
            currentIndex = (currentIndex + 1) % (bodyDivs.length - 1);
            updateContainerTransform();
        }

        updateContainerTransform();
        setInterval(autoRotate, 5000);
    });
