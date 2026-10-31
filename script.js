document.addEventListener("DOMContentLoaded", () => {
    // 1. تأثير الورود الطائرة في الخلفية
    const rosesContainer = document.getElementById("floatingRoses");
    const roseIcons = ["🌸", "🌹", "🌷"];
    
    function createRose() {
        const rose = document.createElement("div");
        rose.classList.add("rose-icon");
        rose.innerText = roseIcons[Math.floor(Math.random() * roseIcons.length)];
        rose.style.left = Math.random() * 100 + "vw";
        rose.style.animationDuration = Math.random() * 5 + 7 + "s"; // بين 7 و 12 ثانية
        rose.style.fontSize = Math.random() * 10 + 15 + "px"; // بين 15 و 25 بكسل
        rosesContainer.appendChild(rose);
        
        // حذف العنصر بعد انتهاء الانيميشن
        setTimeout(() => { rose.remove(); }, 12000);
    }
    
    // إنشاء وردة جديدة كل نصف ثانية
    setInterval(createRose, 500);

    // 2. بوابة التاريخ الماسي
    const unlockBtn = document.getElementById("unlockBtn");
    const dateInput = document.getElementById("dateInput");
    const gallerySection = document.getElementById("gallerySection");
    const dateErrorMessage = document.getElementById("dateErrorMessage");
    const CORRECT_DATE = "21/2/2026";

    unlockBtn.addEventListener("click", () => {
        if (dateInput.value.trim() === CORRECT_DATE) {
            // فتح المعرض
            gallerySection.classList.remove("hidden");
            dateErrorMessage.classList.add("hidden");
            document.querySelector(".date-gate-section").classList.add("hidden");
            // تمرير الشاشة للمعرض
            gallerySection.scrollIntoView({ behavior: 'smooth' });
            loadGallery(); // تحميل محتويات المعرض
        } else {
            // إظهار رسالة خطأ
            dateErrorMessage.classList.remove("hidden");
        }
    });

    // 3. معرض الصور والفيديوهات
    const imagesGrid = document.getElementById("imagesGrid");
    const videosGrid = document.getElementById("videosGrid");
    let galleryLoaded = false;

    function loadGallery() {
        if (galleryLoaded) return; // عدم التحميل مرتين

        // توليد 27 صورة
        for (let i = 1; i <= 27; i++) {
            const item = document.createElement("div");
            item.className = "media-item";
            // تأكد من تسمية ملفاتك photo_1.jpg ... photo_27.jpg في مجلد media
            const imgSrc = `./media/photo_${i}.jpg`; 
            item.innerHTML = `<img src="${imgSrc}" alt="ذكرى صور ${i}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x250?text=Image+${i}'">`;
            
            // إضافة حدث النقر لفتح اللايت بوكس
            item.addEventListener("click", () => openLightbox(imgSrc));
            imagesGrid.appendChild(item);
        }

        // توليد 12 فيديو
        for (let j = 1; j <= 12; j++) {
            const item = document.createElement("div");
            item.className = "media-item";
            // تأكد من تسمية ملفاتك video_1.mp4 ... video_12.mp4 في مجلد media
            const videoSrc = `./media/video_${j}.mp4`;
            item.innerHTML = `<video src="${videoSrc}" controls preload="metadata"></video>`;
            videosGrid.appendChild(item);
        }
        galleryLoaded = true;
    }

    // تبديل التبويبات (صور / فيديوهات)
    const tabLinks = document.querySelectorAll(".tab-link");
    tabLinks.forEach(link => {
        link.addEventListener("click", () => {
            // إزالة الكلاس النشط من الجميع
            tabLinks.forEach(l => l.classList.remove("active"));
            // إضافة الكلاس النشط للمنقر عليه
            link.classList.add("active");
            
            const type = link.getAttribute("data-type");
            if (type === "images") {
                imagesGrid.classList.remove("hidden");
                videosGrid.classList.add("hidden");
            } else {
                imagesGrid.classList.add("hidden");
                videosGrid.classList.remove("hidden");
            }
        });
    });

    // 4. اللايت بوكس (Lightbox)
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const closeLightbox = document.getElementById("closeLightbox");

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.remove("hidden");
        document.body.style.overflow = "hidden"; // منع سكرول الصفحة
    }

    closeLightbox.addEventListener("click", () => {
        lightbox.classList.add("hidden");
        document.body.style.overflow = ""; // إعادة سكرول الصفحة
    });

    // إغلاق عند النقر خارج الصورة
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.classList.add("hidden");
            document.body.style.overflow = "";
        }
    });

    // 5. لعبة الـ 10 معلومات (حفظ محلي وتصدير)
    const questions = [
        "أكتر صفة بتحبيها فيا؟",
        "أكلة نِفسك ناكلها سوا؟",
        "أكتر ذكرى بتضحكك لينا؟",
        "كلمة دايماً بنقولها لبعض؟",
        "أغنية بتفكرك بيا؟",
        "أكتر حاجة بتطمنك في وجودي؟",
        "عادة غريبة فيا بس متقبلاها؟",
        "مكان نِفسك نسافر له مع بعض؟",
        "أول انطباع ليكي عني؟",
        "وعد نِفسك نوعده لبعض للسكين؟"
    ];

    const questionsContainer = document.getElementById("questionsInputList");
    const btnPlayer1 = document.getElementById("btnPlayer1");
    const btnPlayer2 = document.getElementById("btnPlayer2");
    const answersForm = document.getElementById("answersForm");
    const gameStatus = document.getElementById("gameStatus");

    let currentVisiblePlayer = "player1"; // يمكن أن يكون "player1" أو "player2"
    
    // مخزن البيانات (يتم تحميله من LocalStorage إذا وجد)
    let allAnswers = JSON.parse(localStorage.getItem("wardna_game_answers")) || {
        player1: {},
        player2: {}
    };

    // وظيفة لتوليد حقول الأسئلة
    function renderQuestions() {
        questionsContainer.innerHTML = ""; // مسح المحتوى القديم
        
        questions.forEach((qText, index) => {
            const qKey = `q_${index + 1}`;
            // جلب الإجابة المخزنة إذا وجدت
            const savedValue = allAnswers[currentVisiblePlayer][qKey] || "";
            
            const group = document.createElement("div");
            group.className = "question-group";
            group.innerHTML = `
                <label>${index + 1}. ${qText}</label>
                <input type="text" name="${qKey}" value="${savedValue}" placeholder="اكتبي الإجابة هنا...">
            `;
            questionsContainer.appendChild(group);
        });
    }

    // تبديل اللاعبين
    function switchPlayer(player) {
        // حفظ إجابات اللاعب الحالي قبل التبديل
        saveCurrentVisibleInputs();
        
        currentVisiblePlayer = player;
        // تحديث مظهر الأزرار
        btnPlayer1.classList.toggle("active", player === "player1");
        btnPlayer2.classList.toggle("active", player === "player2");
        // إعادة توليد الأسئلة ببيانات اللاعب الجديد
        renderQuestions();
    }

    btnPlayer1.addEventListener("click", () => switchPlayer("player1"));
    btnPlayer2.addEventListener("click", () => switchPlayer("player2"));

    // حفظ المدخلات الحالية في الكائن العام (allAnswers)
    function saveCurrentVisibleInputs() {
        const formData = new FormData(answersForm);
        // تأكد من وجود كائن للاعب الحالي
        if (!allAnswers[currentVisiblePlayer]) allAnswers[currentVisiblePlayer] = {};
        
        // تحديث الإجابات من الفورم
        for (let [key, value] of formData.entries()) {
            allAnswers[currentVisiblePlayer][key] = value;
        }
    }

    // حفظ نهائي في LocalStorage عند الضغط على زر الحفظ
    answersForm.addEventListener("submit", (e) => {
        e.preventDefault(); // منع إعادة تحميل الصفحة
        saveCurrentVisibleInputs();
        localStorage.setItem("wardna_game_answers", JSON.stringify(allAnswers));
        
        gameStatus.innerText = "✅ تم حفظ جميع الإجابات بأمان في متصفحك!";
        setTimeout(() => { gameStatus.innerText = ""; }, 4000); // إخفاء الرسالة بعد 4 ثواني
    });

    // تصدير الإجابات كملف JSON
    document.getElementById("exportBtn").addEventListener("click", () => {
        saveCurrentVisibleInputs(); // حفظ آخر التعديلات
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allAnswers, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "حكايتنا_إجابات_اللعبة.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    // استيراد الإجابات من ملف JSON
    document.getElementById("importInput").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                // تحقق بسيط من هيكل الملف
                if (importedData.player1 && importedData.player2) {
                    allAnswers = importedData;
                    // حفظ في الـ LocalStorage
                    localStorage.setItem("wardna_game_answers", JSON.stringify(allAnswers));
                    // تحديث الشاشة
                    renderQuestions();
                    gameStatus.innerText = "📥 تم استيراد الإجابات بنجاح!";
                    setTimeout(() => { gameStatus.innerText = ""; }, 4000);
                } else {
                    alert("الملف المرفوع غير صالـح لعـبة حكايتنا.");
                }
            } catch (err) {
                alert("حدث خطأ أثناء قراءة الملف. تأكدي أنه ملف JSON صالح.");
            }
        };
        reader.readAsText(file);
    });

    // التشغيل الأولي للعبة
    renderQuestions();
});