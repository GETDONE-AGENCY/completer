console.log("Content script loaded");

function findComposeToolbar(){
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gu.Up',
        'gU.Up'
    ]
    for(const selector of selectors){
        const toolbar = document.querySelector(selector);
        if(toolbar){
            return toolbar;
        }
    }
    return null;
}

function createAIButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.style.backgroundColor = '#4285f4';
    button.style.color = 'white';
    button.style.padding = '8px 16px';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '13px';
    button.style.fontWeight = 'bold';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role','button');
    button.setAttribute('data-tooltip','Generate AI Reply');
    
    return button;
 }


function getEmailContent(){
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]',
        'm_-3792866977818487366color_body'
    ]
    for(const selector of selectors){
        const content = document.querySelector(selector);
        if(content){
            console.log(content.innerText);
            return content.innerText.trim();
        }
    }
    return '';
    console.log('No content found');
}

function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if(existingButton) existingButton.remove();

    const toolbar = findComposeToolbar();
    if(!toolbar){
        console.log("Toolbar not found.");
        return;
    }
    console.log("Toolbar found.");

    const button = createAIButton();

    button.classList.add('ai-reply-button');

    button.addEventListener('click', async() =>{
        try {
            button.innerHTML='Generating...';
            button.disabled = true;
            
            const emailContent = getEmailContent();
            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    emailContent: emailContent,
                    tone: "professional"
                })


            });

            if (!response.ok){
                throw new Error('API req failed. ' )
            }

            const generatedReply = await response.text();

            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

            if(composeBox){
                composeBox.focus(); 
                document.execCommand('insertText', false, generatedReply);
            }else{
                throw new Error('Compose Box not found.');
            }
        } catch (error) {
            console.error('Failed to generate reply:', error);
            button.innerHTML = 'Error - Try Again';
        } finally{
            button.innerHTML = 'AI Reply';
            button.disabled = false;
        }
    

    });

    toolbar.insertBefore(button, toolbar.firstChild);

} 

const observer = new MutationObserver((mutationsList, observer) => {
    for(const mutation of mutationsList) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeELements = addedNodes.some(node => 
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );
        if (hasComposeELements) {
            console.log("Compose element found");
            setTimeout(injectButton, 500);
        }
    
    }
});

observer.observe(document.body, { childList: true, subtree: true });
