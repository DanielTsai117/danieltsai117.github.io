// 塔羅牌圖片URL數組
const tarotDeck = [
          // 空白牌   
            'https://i.imgur.com/Sm8GSza.png',
          // 大牌
            'https://i.imgur.com/wMxoIuK.png',
            'https://i.imgur.com/kaJJrsG.png',
            'https://i.imgur.com/2wB3ShI.png',
            'https://i.imgur.com/yKq3lwM.png',
            'https://i.imgur.com/oRNEmjL.png',
            'https://i.imgur.com/hlap61l.png',
            'https://i.imgur.com/jjjQ0DG.png',
            'https://i.imgur.com/zXqFmj1.png',
            'https://i.imgur.com/XFM3Vae.png',
            'https://i.imgur.com/aJi6fpH.png',
            'https://i.imgur.com/VemVogd.png',
            'https://i.imgur.com/YctSRiv.png',
            'https://i.imgur.com/BbwXL7T.png',
            'https://i.imgur.com/f1JRQsB.png',
            'https://i.imgur.com/XsaDNvD.png',
            'https://i.imgur.com/pZ2PxPp.png',
            'https://i.imgur.com/GqTuqvo.png',
            'https://i.imgur.com/yNToWOc.png',
            'https://i.imgur.com/a0esOek.png',
            'https://i.imgur.com/4kpP6m0.png',
            'https://i.imgur.com/trjFmGF.png',
            'https://i.imgur.com/TWyjkwO.png',
 
    // 小牌
];

// 存儲已抽取的卡牌索引和狀態
let drawnCards = new Set();

// 抽牌函數
function drawCards(cardCount, buttonId) {
    // 重置其他按鈕和清空已抽取的卡牌集合
    resetCards();

    // 禁用當前按鈕
    document.getElementById(buttonId).disabled = true;

    // 獲取卡片容器元素
    const cardsContainer = document.getElementById('cards');

    // 清空卡片容器
    cardsContainer.innerHTML = '';

    // 抽取指定數量的卡牌
    for (let i = 0; i < cardCount; i++) {
        let randomIndex;
        let cardReversed;

        // 確保不重複抽取同一張牌，無論是正位還是倒位
        do {
            randomIndex = Math.floor(Math.random() * tarotDeck.length);
            cardReversed = Math.random() < 0.5; // 50%的機率使卡片逆位
        } while (drawnCards.has(`${randomIndex}-${cardReversed}`) || drawnCards.has(`${randomIndex}-${!cardReversed}`));

        // 將抽到的牌的索引和狀態添加到已抽取集合中
        drawnCards.add(`${randomIndex}-${cardReversed}`);

        // 創建卡片元素
        const card = document.createElement('div');
        card.className = 'card';
        if (cardReversed) {
            card.classList.add('reversed');
        }

        // 如果是萬用牌陣的第一張牌，添加特殊類
        if (buttonId === 'universal-button' && i === 0) {
            card.classList.add('universal-first');
        }

        // 如果是關係牌陣的第一張和第二張牌，添加不同的特殊類
        if (buttonId === 'relationship-button' && (i === 0 || i === 1)) {
            card.classList.add('relationship-first');
        }

        // 創建圖片元素
        const img = document.createElement('img');
        img.src = tarotDeck[randomIndex];
        img.alt = '塔羅牌';

        // 將圖片添加到卡片中，然後將卡片添加到容器中
        card.appendChild(img);
        cardsContainer.appendChild(card);

        // 創建文字容器
        const textContainer = document.createElement('div');
        textContainer.style.marginTop = '10px';

        // 根據不同的牌陣添加相應的文字
        if (buttonId === 'relationship-button') {
            if (i === 0) {
                textContainer.textContent = '自己';
            } else if (i === 1) {
                textContainer.textContent = '對方';
            } else if (i === 2) {
                textContainer.textContent = '現在';
            } else {
                textContainer.textContent = '未來';
            }
            card.appendChild(textContainer);
        } else if (buttonId === 'time-flow-button') {
            if (i === 0) {
                textContainer.textContent = '過去';
            } else if (i === 1) {
                textContainer.textContent = '現在';
            } else if (i === 2) {
                textContainer.textContent = '未來';
            }
            card.appendChild(textContainer);
        }
    }

    // 在抽牌後添加重置按鈕
    const resetContainer = document.getElementById('reset-container');
    resetContainer.innerHTML = '<button class="reset-button" onclick="resetCards()">重置</button>';
}

// 重置函數
function resetCards() {
    // 清空牌組
    const cardsContainer = document.getElementById('cards');
    cardsContainer.innerHTML = '';

    // 重新啟用所有抽牌按鈕
    document.querySelectorAll('.draw-button').forEach(button => button.disabled = false);

    // 清空已抽取的卡牌集合
    drawnCards.clear();

    // 移除重置按鈕
    const resetContainer = document.getElementById('reset-container');
    resetContainer.innerHTML = '';
}
