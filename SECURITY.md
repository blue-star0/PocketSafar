# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions of PocketSafar:

| Version   | Supported          | Status        |
| --------- | ------------------ | ------------- |
| 2025.1.x  | :white_check_mark: | Current       |
| 2024.2.x  | :white_check_mark: | LTS           |
| 2024.1.x  | :x:                | End of Life   |
| < 2024.1  | :x:                | Not Supported |

**Note**: We recommend always using the latest stable release to ensure you have the most up-to-date security patches and features.

## Reporting a Security Vulnerability

### Direct Security Contact

If you discover a security vulnerability in PocketSafar, please report it to our security team:

**Email**: security@pocketsafar.org  
**Alternative**: Create a private security advisory via [GitHub Security Advisories](https://github.com/PocketSafar/PocketSafar/security/advisories/new)

### Reporting Instructions

When reporting a vulnerability, please include:

1. **Description**: A clear description of the vulnerability
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Impact Assessment**: Your assessment of the potential impact
4. **Affected Versions**: Which versions are affected
5. **Proof of Concept**: If applicable, include PoC code or screenshots (non-destructive)
6. **Suggested Fix**: If you have recommendations for remediation

### Response Timeline

- **Initial Response**: Within 48 hours of report submission
- **Status Updates**: Every 5-7 business days until resolution
- **Severity Assessment**: Within 5 business days
- **Fix Timeline**: 
  - Critical vulnerabilities: 7-14 days
  - High severity: 14-30 days
  - Medium/Low severity: 30-90 days

### Urgent Cases

For **critical vulnerabilities** that pose immediate risk:

- Mark your email subject with **[URGENT]**
- Include "Critical" in the severity assessment
- We will prioritize review and response within 24 hours
- Emergency patches will be fast-tracked for release

### Responsible Disclosure Process

We follow a responsible disclosure policy:

1. **Report Received**: We acknowledge receipt of your report
2. **Investigation**: Our team validates and assesses the vulnerability
3. **Confirmation**: We confirm the vulnerability and provide expected fix timeline
4. **Fix Development**: We develop and test the security patch
5. **Coordinated Release**: We coordinate the disclosure timeline with you
6. **Public Disclosure**: After the fix is released, we publish a security advisory

**Disclosure Timeline**: We aim to resolve and disclose vulnerabilities within 90 days of the initial report. We will work with you to ensure proper coordination.

### What to Expect

**If Accepted**:
- We will confirm the vulnerability and work on a fix
- You will receive updates on our progress
- We will coordinate disclosure timing with you
- You will be credited in the security advisory (if desired)

**If Declined**:
- We will provide a clear explanation of why the report was not accepted
- We may suggest alternative reporting paths if applicable
- You are welcome to request clarification or appeal the decision

### Credit and Recognition

We believe in recognizing the valuable contributions of security researchers:

- **Public Credit**: With your permission, we will credit you in our security advisories and release notes
- **Hall of Fame**: Contributors will be listed in our Security Hall of Fame (coming soon)
- **CVE Assignment**: For significant vulnerabilities, we will work with you on CVE assignment

**How to be credited**:
- Specify your preferred name/handle in your report
- Provide links (Twitter, GitHub, website) you'd like included
- Let us know if you prefer to remain anonymous

### Security Best Practices for Users

1. Always keep PocketSafar updated to the latest version
2. Regularly review security advisories in our [Security tab](https://github.com/PocketSafar/PocketSafar/security)
3. Follow our security configuration guidelines in the documentation
4. Enable two-factor authentication where applicable
5. Report suspicious behavior immediately

### Out of Scope

The following are generally not considered security vulnerabilities:

- Issues in outdated/unsupported versions (< 2024.1)
- Social engineering attacks
- Denial of service through resource exhaustion requiring excessive resources
- Issues requiring physical access to a user's device
- Vulnerabilities in third-party dependencies (report to the respective projects)

### Legal

We will not pursue legal action against researchers who:

- Make a good faith effort to avoid privacy violations and data destruction
- Follow responsible disclosure practices
- Do not exploit vulnerabilities beyond what is necessary to demonstrate the issue

### Contact for Questions

For questions about this security policy or our security practices:

- **Email**: security@pocketsafar.org
- **General Inquiries**: info@pocketsafar.org

Thank you for helping keep PocketSafar and our users safe!
