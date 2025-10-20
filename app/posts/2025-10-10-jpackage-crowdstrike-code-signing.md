---
title: "Getting jpackage to Work with CrowdStrike"
date: 2025-10-10
type: post
template: post.html
active_nav: writing
excerpt: "How to properly code sign jpackage applications to avoid CrowdStrike quarantine on macOS."
---

I wrote a [small terminal agent called Gus](https://github.com/carimura/gus) in Java named after one of my dogs (the big one) to play around with building agents and using tools and stuff. I might rename it to arc but that's my [static site generator](https://chad.cm/posts/2025-05-28-building-arc). I think the name arc is cooler, whereas Gus is more for loafing around with the chickens and looking homeless. I digress.

I discovered the hard way that because CrowdStrike is installed on my machine, I couldn't run apps built with `jpackage`, which is Java's packaging tool to bundle a runtime with your app and produce a native package. I use this for command-line stuff in Java. Like Arc. And Gus. Everything was fine on my home machine. Until they met my work machine. CrowdStrike would kill my app and quarantine the executable file. I'm guessing our IT group will provide an exception for me, but I felt like learning more so I dove in.

[Update: As suspected, this was a CrowdStrike false positive because running jpackage locally on your own app shouldn't be a threat. Distributing it might be, of course, and thus it should be signed.]


## The Problem

The problem is because running a jpackage-built app results in the process being killed immediately:

```bash
./output/Hello.app/Contents/MacOS/Hello
[1]    30464 killed     ./output/Hello.app/Contents/MacOS/Hello
```

CrowdStrike Falcon quarantines the executable because of a file called `libjli.dylib`, which is a core part of the JVM launcher, but also is unsigned (or ad-hoc signed or something). Apparently this isn't very trustworthy. Like Gus himself. The real Gus has been licking his lips around the baby chickens. The protector becomes the aggressor.

## The Solution

### 1. Get an Apple Developer Certificate

Once enrolled in the Apple Developer Program, you need to create a **Developer ID Application** certificate (not "Apple Development" or "Mac App Distribution"). This is specifically for signing apps distributed outside the Mac App Store.

### 2. Create a Certificate Signing Request

```bash
openssl req -new -newkey rsa:2048 -nodes \
  -keyout DeveloperID.key \
  -out CertificateSigningRequest.certSigningRequest \
  -subj "/emailAddress=you@example.com/CN=Your Name/C=US"
```

Upload the `.certSigningRequest` file to Apple Developer portal, select G2 Sub-CA, and download the resulting `.cer` file.

### 3. Import the Certificate

```bash
# Import the certificate
security import developerID_application.cer -k ~/Library/Keychains/login.keychain-db

# Import the private key
security import DeveloperID.key -k ~/Library/Keychains/login.keychain-db

# Download and import Apple's intermediate certificate
curl -O https://www.apple.com/certificateauthority/DeveloperIDG2CA.cer
security import DeveloperIDG2CA.cer -k ~/Library/Keychains/login.keychain-db

# Verify it's available
security find-identity -v -p codesigning
```

You should see your Developer ID Application identity listed.

### 4. Create an Entitlements File

The JVM requires specific entitlements to run with hardened runtime:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.disable-library-validation</key>
    <true/>
</dict>
</plist>
```

Save this as `entitlements.plist`.

### 5. Build and Sign with jpackage

```bash
jpackage \
  --name Hello \
  --type app-image \
  --input /path/to/input \
  --main-jar Hello.jar \
  --dest /path/to/output \
  --runtime-image /path/to/runtime \
  --mac-sign \
  --mac-signing-key-user-name "Developer ID Application: Your Name (TEAMID)" \
  --verbose
```

If jpackage doesn't apply entitlements correctly, you'll need to manually re-sign (update: this is a bug that has been fixed and should ship in JDK 26 making this step unnecessary):

```bash
codesign --force --sign "Developer ID Application: Your Name (TEAMID)" \
  --entitlements entitlements.plist \
  --deep --options runtime \
  output/Hello.app
```

### 6. Verify the Signature

```bash
codesign -dv output/Hello.app/Contents/MacOS/Hello
codesign -d --entitlements - --xml output/Hello.app/Contents/MacOS/Hello
```

You should see your Developer ID signature and the entitlements listed.

## Boom

```bash
❯ ./output/Hello.app/Contents/MacOS/Hello
Hello, Chad
```

Boom.

---

## Update: Maven settings to make this all happen as an optional profile step

I'm taking this code out of my demos now since I can run this all unsigned on my work laptop. But if anyone wants to distribute a jpackaged app to folks on machines running greedy AI security bots, the code below is for you.

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.panteleyev</groupId>
            <artifactId>jpackage-maven-plugin</artifactId>
            <executions>
                <execution>
                    <id>create-installer</id>
                    <phase>package</phase>
                    <goals>
                        <goal>jpackage</goal>
                    </goals>
                    <configuration>
                        <name>YourApp</name>
                        <type>APP_IMAGE</type>
                        <!-- ... other config ... -->
                        <!-- NO macSign, macSigningKeyUserName, or macEntitlements here -->
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>

<profiles>
    <profile>
        <id>signed</id>
        <build>
            <plugins>
                <plugin>
                    <groupId>org.panteleyev</groupId>
                    <artifactId>jpackage-maven-plugin</artifactId>
                    <executions>
                        <execution>
                            <id>create-installer</id>
                            <configuration>
                                <macSign>true</macSign>
                                <macSigningKeyUserName>${env.MAC_SIGNING_KEY_NAME}</macSigningKeyUserName>
                                <macEntitlements>${env.MAC_ENTITLEMENTS}</macEntitlements>
                            </configuration>
                        </execution>
                    </executions>
                </plugin>

                <!-- temp fix until JDK 26 I hope -->
                <plugin>
                    <groupId>org.codehaus.mojo</groupId>
                    <artifactId>exec-maven-plugin</artifactId>
                    <version>3.1.0</version>
                    <executions>
                        <execution>
                            <id>resign-with-entitlements</id>
                            <phase>package</phase>
                            <goals>
                                <goal>exec</goal>
                            </goals>
                            <configuration>
                                <executable>codesign</executable>
                                <arguments>
                                    <argument>--force</argument>
                                    <argument>--sign</argument>
                                    <argument>${env.MAC_SIGNING_KEY_NAME}</argument>
                                    <argument>--entitlements</argument>
                                    <argument>${env.MAC_ENTITLEMENTS}</argument>
                                    <argument>--options</argument>
                                    <argument>runtime</argument>
                                    <argument>--deep</argument>
                                    <argument>${project.build.directory}/jpackage/YourApp.app</argument>
                                </arguments>
                            </configuration>
                        </execution>
                    </executions>
                </plugin>
            </plugins>
        </build>
    </profile>
</profiles>
```

Set the environment variables before running the signed build:

```bash
export MAC_SIGNING_KEY_NAME="Developer ID Application: Your Name (TEAMID)"
export MAC_ENTITLEMENTS="/path/to/entitlements.plist"
mvn package -Psigned
```

This keeps your local development builds fast and only runs the signing steps when you actually need them for distribution.