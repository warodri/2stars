import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-screen-main',
    standalone: false,
    templateUrl: './screen-main.html',
    styleUrl: './screen-main.scss',
})
export class ScreenMain {
    heroImageUrl = '/hero.png';
    aiPrompt = '';
    selectedSupportProduct = 'VerifAI';
    supportRequestSent = false;
    selectedContactType: string | null = null;
    contactRequestSent = false;

    readonly contactOptions = [
        {
            id: 'custom',
            label: 'Custom applications',
            title: 'Tell us about your business and the custom development you need.',
            description: 'Share the workflow, problem, or product idea you want us to design and build for your team.',
            cta: 'Submit custom project request'
        },
        {
            id: 'general',
            label: 'General questions',
            title: 'Ask anything about 2stars, our products, or how we work.',
            description: 'Use this for partnerships, product questions, commercial conversations, or anything that does not fit a support ticket.',
            cta: 'Submit general inquiry'
        },
        {
            id: 'scheduling',
            label: 'Scheduling',
            title: 'Book time with us for a walkthrough, intro call, or product discussion.',
            description: 'Use this option if you want to coordinate a meeting, demo, or working session with the team.',
            cta: 'Submit scheduling request'
        }
    ];

    readonly suggestedPrompts = [
        'What does 2stars.io build for business?',
        'Show me your products and pricing options.',
        'How can I contact you for a custom AI application?',
        'Which product should I start with for my team?'
    ];

    readonly products = [
        {
            id: 'verifai',
            name: 'VerifAI',
            tagline: 'Zero-knowledge device identity verification.',
            description: 'Verify the device, not the user. Prevent SIM swap attacks, phishing, and credential theft with hardware-bound identity and no personal data storage.',
            price: 'Enterprise pricing'
        },
        {
            id: 'relai',
            name: 'RelAI',
            tagline: 'AI-powered messaging flows.',
            description: 'Create full WhatsApp, RCS, or Telegram flows with simple prompts. Connect your provider and go live fast while we help with onboarding and approvals.',
            price: 'From £99/mo'
        },
        {
            id: 'vision-ai',
            name: 'Vision AI',
            tagline: 'Recognition engine for real-world interaction.',
            description: 'Enable customers to scan faces, environments, or products and receive instant recommendations that bridge physical and digital experiences.',
            price: 'Custom deployment'
        },
        {
            id: 'ai-chat',
            name: 'AI Chat',
            tagline: 'Messaging redefined.',
            description: 'Flat monthly pricing with no cost per message. Automate conversations, trigger workflows, collect payments, and support users in one platform.',
            price: 'From £299/mo'
        }
    ];

    useSuggestedPrompt(prompt: string): void {
        this.aiPrompt = prompt;
    }

    submitSupportTicket(): void {
        this.supportRequestSent = true;
    }

    openContactForm(contactType: string): void {
        this.selectedContactType = contactType;
        this.contactRequestSent = false;
    }

    submitContactRequest(): void {
        this.contactRequestSent = true;
    }

    get selectedContactOption() {
        return this.contactOptions.find(option => option.id === this.selectedContactType) ?? null;
    }

    ngAfterViewInit(): void {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08 }
        );

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    
}
