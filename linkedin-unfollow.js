// LinkedIn Auto Unfollow Script
// This script automates unfollowing connections on LinkedIn.
// Note: LinkedIn restricts the number of loaded connections to 915 (maybe more?), so this script will not process more than that.
// Developed by lvl-4.com

(function unfollowAll() {
    const delay = 1500; // 1.5-second delay between each action
    const scrollCheckDelay = 3000; // 3-second delay to check for new buttons after scrolling
    let isProcessing = false;

    async function clickFollowingButtons() {
        const followingButtons = Array.from(document.querySelectorAll('button[aria-label^="Click to stop following"]'));
        if (followingButtons.length === 0) {
            console.log("No 'Following' buttons found. Scrolling to load more...");
            await scrollAndCheck();
            return;
        }

        isProcessing = true;

        for (let i = 0; i < followingButtons.length; i++) {
            const button = followingButtons[i];
            button.click();
            console.log(`Clicked 'Following' button for ${button.getAttribute('aria-label').replace('Click to stop following ', '')}`);

            // Wait for the alert dialog to appear
            await wait(delay);

            // Click the "Unfollow" button in the alert dialog
            const unfollowButton = document.querySelector('button[data-test-dialog-primary-btn]');
            if (unfollowButton && unfollowButton.textContent.trim() === "Unfollow") {
                unfollowButton.click();
                console.log(`Unfollowed ${button.getAttribute('aria-label').replace('Click to stop following ', '')}`);
            } else {
                console.log("Failed to find or click the 'Unfollow' button in the alert dialog.");
            }

            // Wait before processing the next button
            await wait(delay);
        }

        // After processing all buttons, check for more buttons
        isProcessing = false;
        await clickFollowingButtons();
    }

    async function scrollAndCheck() {
        // Scroll down to load more connections
        window.scrollTo(0, document.body.scrollHeight);
        console.log("Scrolled down to load more connections.");

        // Wait for 3 seconds and check for new buttons
        await wait(scrollCheckDelay);

        const newButtons = Array.from(document.querySelectorAll('button[aria-label^="Click to stop following"]'));
        if (newButtons.length > 0) {
            console.log("New 'Following' buttons found. Processing...");
            await clickFollowingButtons();
        } else {
            console.log("No new 'Following' buttons found. Scrolling again...");
            await scrollAndCheck(); // Scroll and check again
        }
    }

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    clickFollowingButtons();
})();