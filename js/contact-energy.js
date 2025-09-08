/**
 * エネルギー事業お問い合わせフォーム
 * JavaScript制御ファイル
 */

// 詳細カテゴリーデータ
const detailCategories = {
    '営農型太陽光発電': [
        '新規導入のご相談',
        '既存農地への設置検討',
        'ソーラーシェアリング全般',
        '補助金・助成金について',
        '収益シミュレーション',
        'その他'
    ],
    '自家消費型太陽光発電': [
        '工場・倉庫への設置',
        '事業所・オフィスビルへの設置',
        '商業施設への設置',
        '初期費用・ROI試算',
        'PPAモデルのご相談',
        'その他'
    ],
    'メンテナンス': [
        '定期点検・保守',
        'パネル清掃',
        '故障・修理対応',
        'パワコン交換',
        'モニタリングシステム',
        'その他'
    ],
    'その他': [
        '太陽光発電の基礎知識',
        '資材のみ購入',
        '施工業者の紹介',
        'セカンドオピニオン',
        '一般的なご質問'
    ]
};

// DOMContentLoadedイベント
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
});

/**
 * フォームの初期化
 */
function initializeForm() {
    // 日付入力の最小値を今日に設定
    const today = new Date().toISOString().split('T')[0];
    const consultDateInput = document.querySelector('input[type="date"]');
    if (consultDateInput) {
        consultDateInput.setAttribute('min', today);
    }
}

/**
 * イベントリスナーの設定
 */
function setupEventListeners() {
    // サービスタイプ選択時の処理
    const serviceRadios = document.querySelectorAll('input[name="serviceType"]');
    serviceRadios.forEach(radio => {
        radio.addEventListener('change', handleServiceTypeChange);
    });

    // フォーム送信処理
    const form = document.getElementById('energyContactForm');
    form.addEventListener('submit', handleFormSubmit);

    // リセットボタンの処理
    form.addEventListener('reset', handleFormReset);

    // リアルタイムバリデーション
    setupRealtimeValidation();
}

/**
 * サービスタイプ変更時の処理
 */
function handleServiceTypeChange(e) {
    const selectedService = e.target.value;
    
    // エラーメッセージをクリア
    document.getElementById('serviceTypeError').classList.remove('show');
    
    // 詳細カテゴリーの表示/非表示
    const detailSection = document.getElementById('detailOptions');
    const detailSelect = document.getElementById('detailType');
    
    if (selectedService) {
        // 詳細カテゴリーを表示
        detailSection.style.display = 'block';
        
        // オプションを更新
        detailSelect.innerHTML = '<option value="">選択してください</option>';
        if (detailCategories[selectedService]) {
            detailCategories[selectedService].forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                detailSelect.appendChild(option);
            });
        }
    } else {
        detailSection.style.display = 'none';
    }
    
    // システムタイプセクションの表示/非表示
    const systemTypeSection = document.getElementById('systemTypeSection');
    if (selectedService === '営農型太陽光発電') {
        systemTypeSection.style.display = 'block';
    } else {
        systemTypeSection.style.display = 'none';
    }
}

/**
 * リアルタイムバリデーションの設定
 */
function setupRealtimeValidation() {
    // 必須フィールドのリスト
    const requiredFields = [
        { id: 'companyName', errorId: 'companyNameError', type: 'text' },
        { id: 'fullName', errorId: 'fullNameError', type: 'text' },
        { id: 'fullNameKana', errorId: 'fullNameKanaError', type: 'kana' },
        { id: 'email', errorId: 'emailError', type: 'email' },
        { id: 'phone', errorId: 'phoneError', type: 'phone' },
        { id: 'installLocation', errorId: 'installLocationError', type: 'select' },
        { id: 'message', errorId: 'messageError', type: 'text' }
    ];
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            // フォーカスアウト時のバリデーション
            element.addEventListener('blur', function() {
                validateField(field.id, field.errorId, field.type);
            });
            
            // 入力時にエラーをクリア
            element.addEventListener('input', function() {
                document.getElementById(field.errorId).classList.remove('show');
            });
        }
    });
}

/**
 * フィールドのバリデーション
 */
function validateField(fieldId, errorId, type) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    let isValid = true;
    
    if (!field.value.trim()) {
        isValid = false;
    } else {
        switch (type) {
            case 'kana':
                // カタカナのみ（スペース含む）
                const kanaPattern = /^[\u30A0-\u30FF\s]+$/;
                if (!kanaPattern.test(field.value)) {
                    isValid = false;
                }
                break;
            case 'email':
                // メールアドレス形式
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(field.value)) {
                    isValid = false;
                }
                break;
            case 'phone':
                // 電話番号形式（ハイフンあり・なし両対応）
                const phonePattern = /^[0-9]{10,11}$|^[0-9]{2,4}-[0-9]{2,4}-[0-9]{3,4}$/;
                if (!phonePattern.test(field.value.replace(/[^\d-]/g, ''))) {
                    isValid = false;
                }
                break;
        }
    }
    
    if (!isValid) {
        error.classList.add('show');
    } else {
        error.classList.remove('show');
    }
    
    return isValid;
}

/**
 * フォーム送信処理
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // 全体バリデーション
    if (!validateForm()) {
        scrollToFirstError();
        return;
    }
    
    // ローディング表示
    showLoading(true);
    
    // フォームデータの収集
    const formData = collectFormData();
    
    // 送信処理（実際の実装では、ここでサーバーへのAjax送信を行う）
    try {
        await submitFormData(formData);
        
        // 成功時の処理
        showSuccessMessage();
        
        // 自動返信メールの内容をコンソールに出力（開発用）
        console.log('送信データ:', formData);
        console.log('自動返信メール内容:\n', generateAutoReplyEmail(formData));
        
    } catch (error) {
        console.error('送信エラー:', error);
        alert('送信に失敗しました。お手数ですが、もう一度お試しください。');
        showLoading(false);
    }
}

/**
 * フォーム全体のバリデーション
 */
function validateForm() {
    let isValid = true;
    
    // サービスタイプのチェック
    const serviceType = document.querySelector('input[name="serviceType"]:checked');
    if (!serviceType) {
        document.getElementById('serviceTypeError').classList.add('show');
        isValid = false;
    }
    
    // 必須フィールドのチェック
    const requiredFields = [
        { id: 'companyName', errorId: 'companyNameError', type: 'text' },
        { id: 'fullName', errorId: 'fullNameError', type: 'text' },
        { id: 'fullNameKana', errorId: 'fullNameKanaError', type: 'kana' },
        { id: 'email', errorId: 'emailError', type: 'email' },
        { id: 'phone', errorId: 'phoneError', type: 'phone' },
        { id: 'installLocation', errorId: 'installLocationError', type: 'select' },
        { id: 'message', errorId: 'messageError', type: 'text' }
    ];
    
    requiredFields.forEach(field => {
        if (!validateField(field.id, field.errorId, field.type)) {
            isValid = false;
        }
    });
    
    // プライバシーポリシーのチェック
    const privacy = document.getElementById('privacy');
    if (!privacy.checked) {
        document.getElementById('privacyError').classList.add('show');
        isValid = false;
    } else {
        document.getElementById('privacyError').classList.remove('show');
    }
    
    return isValid;
}

/**
 * 最初のエラーまでスクロール
 */
function scrollToFirstError() {
    const firstError = document.querySelector('.error-message.show');
    if (firstError) {
        const rect = firstError.getBoundingClientRect();
        const offset = window.pageYOffset + rect.top - 100;
        window.scrollTo({
            top: offset,
            behavior: 'smooth'
        });
    }
}

/**
 * フォームデータの収集
 */
function collectFormData() {
    const serviceType = document.querySelector('input[name="serviceType"]:checked');
    const systemTypes = Array.from(document.querySelectorAll('input[name="systemType"]:checked'))
        .map(cb => cb.value);
    
    return {
        // サービス情報
        serviceType: serviceType ? serviceType.value : '',
        detailType: document.getElementById('detailType').value,
        systemTypes: systemTypes.join(', '),
        
        // 設置情報
        installArea: document.getElementById('installArea').value,
        installLocation: document.getElementById('installLocation').value,
        budget: document.getElementById('budget').value,
        timeline: document.getElementById('timeline').value,
        
        // お客様情報
        companyName: document.getElementById('companyName').value,
        department: document.getElementById('department').value,
        fullName: document.getElementById('fullName').value,
        fullNameKana: document.getElementById('fullNameKana').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        
        // 詳細内容
        message: document.getElementById('message').value,
        siteSurvey: document.getElementById('siteSurvey').checked,
        
        // メタ情報
        timestamp: new Date().toLocaleString('ja-JP'),
        referrer: document.referrer,
        userAgent: navigator.userAgent
    };
}

/**
 * フォームデータの送信（サーバー実装用）
 */
async function submitFormData(formData) {
    // 実際の実装では、ここでサーバーへのAjax送信を行う
    // 例：
    // const response = await fetch('/api/contact', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData)
    // });
    // if (!response.ok) throw new Error('送信失敗');
    
    // デモ用：2秒待機
    return new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });
}

/**
 * 自動返信メールの内容生成
 */
function generateAutoReplyEmail(formData) {
    return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【自動返信】お問い合わせを受け付けました
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${formData.fullName} 様

この度は株式会社splightのエネルギー事業へ
お問い合わせいただき、誠にありがとうございます。

以下の内容でお問い合わせを承りました。

────────────────────────────────────
■ ご相談内容
────────────────────────────────────
サービス種別: ${formData.serviceType}
詳細カテゴリー: ${formData.detailType || '未選択'}
${formData.systemTypes ? 'システムタイプ: ' + formData.systemTypes : ''}

────────────────────────────────────
■ 設置予定情報
────────────────────────────────────
設置予定地域: ${formData.installLocation}
設置予定面積: ${formData.installArea || '未記入'}
予算規模: ${formData.budget || '未選択'}
導入予定時期: ${formData.timeline || '未選択'}

────────────────────────────────────
■ お客様情報
────────────────────────────────────
会社名: ${formData.companyName}
部署名: ${formData.department || '未記入'}
ご担当者名: ${formData.fullName}
メールアドレス: ${formData.email}
電話番号: ${formData.phone}

────────────────────────────────────
■ ご相談内容詳細
────────────────────────────────────
${formData.message}

現地調査希望: ${formData.siteSurvey ? '希望する' : '希望しない'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

担当者より2営業日以内にご連絡させていただきます。
お急ぎの場合は、下記までお電話にてご連絡ください。

mobile: 080-1460-3992（平日 9:00-18:00）

今後ともよろしくお願いいたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
株式会社splight エネルギー事業部
〒722-0034 広島県尾道市十四日元町3-21 Sビル3F
TEL: 0848-51-6602 | mobile: 080-1460-3992
Email: info@splight.co.jp
URL: https://splight.co.jp/energy/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
}

/**
 * ローディング表示の制御
 */
function showLoading(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('energyContactForm');
    
    if (show) {
        loadingIndicator.classList.add('show');
        submitBtn.disabled = true;
        form.style.opacity = '0.5';
    } else {
        loadingIndicator.classList.remove('show');
        submitBtn.disabled = false;
        form.style.opacity = '1';
    }
}

/**
 * 成功メッセージの表示
 */
function showSuccessMessage() {
    const form = document.getElementById('energyContactForm');
    const successMessage = document.getElementById('successMessage');
    
    // フォームを非表示
    form.style.display = 'none';
    
    // 成功メッセージを表示
    successMessage.classList.add('show');
    
    // ページトップへスクロール
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * フォームリセット処理
 */
function handleFormReset() {
    // エラーメッセージをすべてクリア
    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.remove('show');
    });
    
    // 詳細オプションを非表示
    document.getElementById('detailOptions').style.display = 'none';
    document.getElementById('systemTypeSection').style.display = 'none';
    
    // ローディングを非表示
    showLoading(false);
}

/**
 * 電話番号の自動フォーマット（オプション機能）
 */
function formatPhoneNumber(input) {
    // 数字のみを抽出
    let value = input.value.replace(/[^\d]/g, '');
    
    // フォーマット適用
    if (value.length > 0) {
        if (value.length <= 3) {
            value = value;
        } else if (value.length <= 7) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        } else if (value.length <= 11) {
            value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
        }
    }
    
    input.value = value;
}

// 電話番号フィールドにフォーマット機能を追加（オプション）
document.addEventListener('DOMContentLoaded', function() {
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
});
