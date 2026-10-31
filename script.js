document.addEventListener("DOMContentLoaded", () => {
    // 1. إنشاء تأثير القلوب المتحركة
    const heartsContainer = document.getElementById("floatingHearts");
    const createHeart = () => {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.innerHTML = "🌸";
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = Math.random() * 3 + 5 + "s";
        heart.style.fontSize = Math.random() * 15 + 15 + "px";
        heartsContainer.appendChild(heart);

        setTimeout(() => heart.remove(), 8000);
    };
    setInterval(createHeart, 600);

    // 2. التحقق من بوابة التاريخ الماسي
    const unlockBtn = document.getElementById("unlockBtn");
    const dateInput = document.getElementById("dateInput");
    const gallerySection = document.getElementById("gallerySection");
    const dateErrorMessage = document.getElementById("dateErrorMessage");

    const TARGET_DATE = "21/2/2026";

    unlockBtn.addEventListener("click", () => {
        const value = dateInput.value.trim();
        if (value === TARGET_DATE || value === "21/02/2026") {
            gallerySection.classList.remove("hidden");
            dateErrorMessage.classList.add("hidden");
            gallerySection.scrollIntoView({ behavior: "smooth" });
            loadGallery();
        } else {
            dateErrorMessage.classList.remove("hidden");
        }
    });

    // 3. بناء معرض الوسائط (27 صورة و 12 فيديو)
    const imagesGrid = document.getElementById("imagesGrid");
    const videosGrid = document.getElementById("videosGrid");
    let galleryLoaded = false;

    function loadGallery() {
        if (galleryLoaded) return;
        
        // بناء 27 صورة من المجلد المحلي media
        for (let i = 1; i <= 27; i++) {
            const item = document.createElement("div");
            item.className = "media-item";
            const imgPath = `./media/photo_${i}.jpg`;
            item.innerHTML = `<img src="${imgPath}" alt="ذكرى ${i}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300?text=صورة+${i}'" />`;
            item.addEventListener("click", () => openLightbox(imgPath));
            imagesGrid.appendChild(item);
        }

        // بناء 12 فيديو من المجلد المحلي media
        for (let j = 1; j <= 12; j++) {
            const item = document.createElement("div");
            item.className = "media-item";
            const videoPath = `./media/video_${j}.mp4`;
            item.innerHTML = `<video src="${videoPath}" controls preload="metadata"></video>`;
            videosGrid.appendChild(item);
        }

        galleryLoaded = true;
    }

    // التبديل بين الصور والفيديوهات
    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            const target = tab.getAttribute("data-tab");
            if (target === "images") {
                imagesGrid.classList.remove("hidden");
                videosGrid.classList.add("hidden");
            } else {
                imagesGrid.classList.add("hidden");
                videosGrid.classList.remove("hidden");
            }
        });
    });

    // 4. Lightbox العارض الكبيرة للصورة
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxClose = document.getElementById("lightboxClose");

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.remove("hidden");
    }

    lightboxClose.addEventListener("click", () => lightbox.classList.add("hidden"));
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) lightbox.classList.add("hidden");
    });

    // 5. لعبة الـ 10 معلومات (Local Storage & JSON Export/Import)
    const questions = [
        "أكثر موقف نضحك عليه كل ما نفتكره؟",
        "الأكلة أو المشروب المفصل لما نتقابل؟",
        "كلمة أو إيفيه مشهور بينا فقط؟",
        "أول انطباع عني في البداية؟",
        "أفضل صفة بتعجبك في صحبتنا؟",
        "أكتر سر أو موضوع اتكلمنا فيه ولسه فاكرينه؟",
        "حاجة تضايقك وممكن أعملها بدون قصد؟",
        "مكان نفسك نسافر له أو نزوره مع بعض؟",
        "أغنية بتفكرك بينا دايماً؟",
        "رسالة خاصة من قلبك بمناسبة الـ ٨ شهور؟"
    ];

    let currentParty = "party1"; // party1 أو party2
    const questionsContainer = document.getElementById("questionsContainer");
    const btnParty1 = document.getElementById("btnParty1");
    const btnParty2 = document.getElementById("btnParty2");
    const gameForm = document.getElementById("gameForm");
    const gameStatus = document.getElementById("gameStatus");

    // مخزن البيانات المحلي
    let answersStore = JSON.parse(localStorage.getItem("wardna_answers")) || {
        party1: {},
        party2: {}
    };

    function renderQuestions() {
        questionsContainer.innerHTML = "";
        questions.forEach((q, index) => {
            const key = `q_${index + 1}`;
            const val = answersStore[currentParty]?.[key] || "";
            
            const div = document.createElement("div");
            div.className = "question-item";
            div.innerHTML = `
                <label>${index + 1}. ${q}</label>
                <input type="text" name="${key}" value="${val}" placeholder="اكتبي الإجابة هنا..." />
            `;
            questionsContainer.appendChild(div);
        });
    }

    btnParty1.addEventListener("click", () => {
        saveCurrentInputs();
        currentParty = "party1";
        btnParty1.classList.add("active");
        btnParty2.classList.remove("active");
        renderQuestions();
    });

    btnParty2.addEventListener("click", () => {
        saveCurrentInputs();
        currentParty = "party2";
        btnParty2.classList.add("active");
        btnParty1.classList.remove("active");
        renderQuestions();
    });

    function saveCurrentInputs() {
        const formData = new FormData(gameForm);
        if (!answersStore[currentParty]) answersStore[currentParty] = {};
        for (let [key, val] of formData.entries()) {
            answersStore[currentParty][key] = val;
        }
    }

    // حفظ البيانات في LocalStorage
    gameForm.addEventListener("submit", (e) => {
        e.preventDefault();
        saveCurrentInputs();
        localStorage.setItem("wardna_answers", JSON.stringify(answersStore));
        gameStatus.textContent = "✅ تم حفظ إجاباتك بنجاح في المتصفح المحلي!";
        setTimeout(() => gameStatus.textContent = "", 4000);
    });

    // التصدير إلى ملف JSON
    document.getElementById("exportBtn").addEventListener("click", () => {
        saveCurrentInputs();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(answersStore, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "wardna-answers.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    // استيراد من ملف JSON
    document.getElementById("importInput").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                if (importedData.party1 || importedData.party2) {
                    answersStore = importedData;
                    localStorage.setItem("wardna_answers", JSON.stringify(answersStore));
                    renderQuestions();
                    gameStatus.textContent = "📥 تم استيراد الإجابات بنجاح!";
                } else {
                    alert("الملف غير صالح للاستيراد!");
                }
            } catch (err) {
                alert("حدث خطأ أثناء قراءة الملف.");
            }
        };
        reader.readAsText(file);
    });

    // التشغيل الأولي للأسئلة
    renderQuestions();
});